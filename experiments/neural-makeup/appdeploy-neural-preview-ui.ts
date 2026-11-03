/**
 * OPTIONAL owner-only cloud comparator for the independent AppDeploy preview.
 * This is NOT bundled into the Cloudflare salon and NOT an offline engine.
 *
 * Integration in separate preview src/main.ts:
 *   import { mountNeuralPreviewPanel } from './neural-preview-ui';
 *   mountNeuralPreviewPanel(document.getElementById('neuralContainer')!);
 * Do not call until the owner-protected route is deployed.
 */
import { api, auth, image } from '@appdeploy/client';

type Result = {
  image: { data: string; mimeType: string; bytes: number };
  experimental: boolean;
  cloud_processed: boolean;
};

const safeText = (value: unknown) => String(value ?? '');

export async function mountNeuralPreviewPanel(mount: HTMLElement) {
  if (!mount) throw Error('Missing neural preview mount element');
  mount.innerHTML = [
    '<section dir="rtl" class="hostedCard" aria-labelledby="cloudTryTitle">',
    '<p style="font-size:11px;letter-spacing:1px">OWNER-ONLY · CLOUD EXPERIMENT</p>',
    '<h3 id="cloudTryTitle">مقایسهٔ آزمایشی انتقال عصبی آرایش</h3>',
    '<p>این گزینه برخلاف موتور آفلاین v19.2 عکس چهره و مرجع را ',
    'فقط پس از رضایت شما به پردازشگر ابری ارسال می‌کند. ',
    'سیاست حریم خصوصی ارائه‌دهندهٔ خارجی اعمال می‌شود. ',
    'مدل، حفظ هویت یا کیفیت برتر را تضمین نمی‌کند.</p>',
    '<p id="neuralAccountStatus" role="status">در حال بررسی حساب مالک...</p>',
    '<button type="button" id="neuralLogin" class="secondary" hidden>ورود مالک</button>',
    '<div id="neuralForm" hidden>',
    '<label>عکس چهرهٔ اصلی<input type="file" id="neuralSource" accept="image/png,image/jpeg,image/webp"></label>',
    '<label>عکس مرجع آرایش<input type="file" id="neuralReference" accept="image/png,image/jpeg,image/webp"></label>',
    '<label>ناحیهٔ آرایش<select id="neuralRegion">',
    '<option value="full">تمام صورت</option><option value="eyes">فقط چشم‌ها</option>',
    '<option value="lips">فقط لب‌ها</option></select></label>',
    '<label>شدت<select id="neuralIntensity">',
    '<option value="medium">طبق مرجع</option><option value="subtle">ملایم</option>',
    '<option value="bold">واضح</option></select></label>',
    '<label style="display:flex;gap:8px;align-items:flex-start;line-height:1.8">',
    '<input type="checkbox" id="neuralConsent">',
    '<span>با ارسال این دو تصویر به سرویس پردازش ابری و ',
    'پردازش آن‌ها برای این درخواست موافقم. این گزینه آفلاین نیست.</span></label>',
    '<button id="neuralSubmit" class="primary" type="button" disabled>',
    'پردازش عصبی (فقط آزمایشی)</button>',
    '<p id="neuralStatus" role="status" aria-live="polite"></p>',
    '<div id="neuralOutput" hidden>',
    '<img id="neuralImage" alt="نتیجهٔ آزمایشی پردازش ابری" ',
    'style="display:block;width:100%;max-width:460px;border-radius:12px">',
    '<a id="neuralDownload" class="secondary" download="hbeauty-neural-test.png">',
    'ذخیرهٔ نتیجه</a>',
    '<a class="secondary" href="/quality-lab.html">ارزیابی در آزمایشگاه کیفیت</a>',
    '</div></div></section>',
  ].join('');

  const $ = (name: string) => mount.querySelector('#' + name) as HTMLElement;
  const status = (text: string) => { $('neuralStatus').textContent = text; };
  const source = $('neuralSource') as HTMLInputElement;
  const reference = $('neuralReference') as HTMLInputElement;
  const consent = $('neuralConsent') as HTMLInputElement;
  const submit = $('neuralSubmit') as HTMLButtonElement;
  const login = $('neuralLogin') as HTMLButtonElement;
  let busy = false;

  const update = () => {
    submit.disabled = busy || !consent.checked || !source.files?.length ||
      !reference.files?.length;
  };
  for (const el of [source, reference, consent]) {
    el.addEventListener('change', update);
  }

  login.onclick = async () => {
    login.disabled = true;
    try {
      await auth.signInWithRedirect();
    } catch (err) {
      $('neuralAccountStatus').textContent =
        'ورود انجام نشد: ' + safeText((err as Error).message);
      login.disabled = false;
    }
  };

  try {
    const currentUser = await auth.getUser();
    if (!currentUser) {
      $('neuralAccountStatus').textContent = 'برای آزمایش باید وارد حساب مالک شوید.';
      login.hidden = false;
      return;
    }
    $('neuralAccountStatus').textContent =
      'حساب متصل است. مجوز مالک هنگام پردازش در سرور بررسی می‌شود.';
    $('neuralForm').hidden = false;
  } catch {
    $('neuralAccountStatus').textContent =
      'بررسی حساب ناموفق بود. تنظیمات ذخیره‌سازی مرورگر را بررسی کنید.';
    login.hidden = false;
    return;
  }

  submit.onclick = async () => {
    if (busy || !source.files?.[0] || !reference.files?.[0] ||
        !consent.checked) return;
    busy = true;
    update();
    $('neuralOutput').hidden = true;
    status('در حال آماده‌سازی تصاویر…');
    try {
      for (const file of [source.files[0], reference.files[0]]) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
            file.size > 15_000_000) {
          throw Error('فرمت نامعتبر یا تصویر بزرگ‌تر از ۱۵ مگابایت.');
        }
      }
      const opts = {
        maxDimension: 1280,
        maxPixels: 1_500_000,
        quality: 0.85,
        mimeType: 'image/jpeg' as const,
      };
      const first = await image.resizeIfNeeded(source.files[0], opts);
      const second = await image.resizeIfNeeded(reference.files[0], opts);
      if (first.bytes + second.bytes > 4_000_000) {
        throw Error('حجم تصاویر پس از فشرده‌سازی بیش از حد مجاز است.');
      }
      // Never upload photos before this explicit consent check.
      if (!consent.checked) throw Error('رضایت ارسال تصویر لغو شد.');
      status('در حال پردازش ابری؛ این گزینه مصرف اعتبار خدمات میزبانی دارد…');
      const response = await api.post('/api/neural-makeup-preview', {
        source: { data: first.data, mimeType: first.mimeType },
        reference: { data: second.data, mimeType: second.mimeType },
        region: ($('neuralRegion') as HTMLSelectElement).value,
        intensity: ($('neuralIntensity') as HTMLSelectElement).value,
        consent: true,
      });
      const result = response.data as Result;
      if (!result.cloud_processed || !result.image?.data ||
          !result.image.mimeType.startsWith('image/')) {
        throw Error('پاسخ پردازشگر معتبر نیست.');
      }
      const dataUrl = 'data:' + result.image.mimeType + ';base64,' +
        result.image.data;
      ($('neuralImage') as HTMLImageElement).src = dataUrl;
      ($('neuralDownload') as HTMLAnchorElement).href = dataUrl;
      $('neuralOutput').hidden = false;
      status('تصویر آزمایشی دریافت شد. وفاداری هویت و بافت را قبل از تأیید بررسی کنید.');
    } catch (err) {
      status('پردازش انجام نشد: ' + safeText((err as Error).message));
    } finally {
      consent.checked = false;
      busy = false;
      update();
    }
  };
}
