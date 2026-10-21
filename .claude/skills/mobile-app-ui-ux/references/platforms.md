# Platforms: web, iOS, Android, cross-platform

The design method is the same everywhere; the conventions and the way tokens are expressed differ. Follow the platform's conventions unless the brand has a strong reason not to, since users' muscle memory is worth more than novelty.

## Contents
1. Convention differences
2. Expressing tokens per stack
3. Stack-specific notes
4. Prototyping deliverables

## 1. Convention differences

| Topic | iOS (HIG) | Android (Material 3) | Web/PWA on phones |
| --- | --- | --- | --- |
| Primary navigation | Tab bar at the bottom, labels always visible | Navigation bar at the bottom (3–5), or a rail on large screens | Bottom tab bar mimicking native |
| Back | Edge-swipe and a back chevron with the previous title | System back gesture or button | Browser back must close sheets, then go back through tabs |
| Sheets | Detents (medium/large), grabber, swipe down | Modal bottom sheets, drag handle | Drawer library with drag-to-dismiss |
| Primary action | Prominent button in content, or a toolbar | FAB (floating action button) or a prominent button | Raised centre tab or sticky footer button |
| Typography | SF Pro, Dynamic Type sizes | Roboto/Google Sans; type scale tokens | Brand fonts via variable web fonts |
| Haptics | Rich (UIImpactFeedbackGenerator) | Vibration and haptic constants | `navigator.vibrate` (Android only) |
| Safe areas | Notch, Dynamic Island, home indicator | Status bar, gesture navigation bar | `env(safe-area-inset-*)` with `viewport-fit=cover` |

## 2. Expressing tokens per stack

| Stack | Colour and roles | Type | Spacing and radius |
| --- | --- | --- | --- |
| CSS / Tailwind v4 | `@theme { --color-* }` plus a `[data-theme=dark]` remap | `@utility t-*` composite styles | `--spacing-*`, `--radius-*` |
| React Native | `tokens.ts` objects with light and dark palettes, selected via `useColorScheme` and context | A `Text` wrapper with a `variant` prop | Constants; `StyleSheet.create` |
| Flutter | `ThemeExtension` for semantic roles; `ColorScheme` for Material roles | A `TextTheme` mapped to the named styles | Constants plus `BorderRadius` tokens |
| SwiftUI | An asset catalog with "Any/Dark" colours, or a `Color` extension per role | A `Font` extension per text style using `.custom(_:size:relativeTo:)` for Dynamic Type | `CGFloat` constants |
| Jetpack Compose | `CompositionLocal` with a custom `Colors` class plus a `MaterialTheme` mapping | `Typography` with named styles | `Dp` constants, `Shapes` |

Keep the same **semantic names** across stacks (`canvas`, `ink2`, `accent`) so design and code stay in sync. Tools such as Style Dictionary can generate all of them from one JSON source.

## 3. Stack-specific notes

- **React Native:** use `react-native-reanimated` for motion, `@gorhom/bottom-sheet` for sheets, `expo-haptics` for haptics, and `expo-font` for loading variable fonts (check that the variable axes are supported; often you need static instances). RTL: `I18nManager.forceRTL` plus logical style props (`marginStart`, `paddingEnd`).
- **Flutter:** `Directionality` and `EdgeInsetsDirectional` for RTL; `Hero` widgets for shared-element transitions; `CupertinoPageRoute` versus `MaterialPageRoute` per platform.
- **SwiftUI:** `matchedGeometryEffect` for shared elements; `.sensoryFeedback`; `.presentationDetents` for sheets; `environment(\.layoutDirection)` for RTL testing.
- **Compose:** `SharedTransitionLayout`; `ModalBottomSheet`; `LocalLayoutDirection`.
- **PWA:** a manifest with name, icons (192/512 plus maskable), theme colour, display `standalone`, shortcuts; `apple-touch-icon`; a service worker caching the shell and images.

## 4. Prototyping deliverables

When the user wants a design rather than production code:
- Produce a **single-file HTML prototype** at mobile size (`max-width` of about 430px, centred), with real interactions (tabs, sheets, a key flow), the design tokens inline at the top, and a short design rationale. It renders anywhere and can be screenshot-tested with the same QA script.
- Include screenshots of every screen at the smallest and the largest phone size.
- For handoff, add a token table and component inventory (or point to the style-guide route).
