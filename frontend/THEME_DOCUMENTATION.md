# ChatApp Theme Implementation Guide

## Overview

A comprehensive dark/light theme system has been implemented throughout the ChatApp project. The theme automatically detects user preference and persists the choice in localStorage. All CSS variables are defined in the root CSS and dynamically applied based on the selected theme.

## Theme Architecture

### 1. CSS Variables System

All theme colors are defined as CSS variables in [main.css](src/main.css) with two complete color schemes:

#### Dark Theme (Default - `:root`)

```css
--bg: #0b1021 /* Main background */ --bg-secondary: #0f172a
    /* Secondary background */ --bg-tertiary: #1a1f3a /* Tertiary background */
    --text-primary: #e2e8f0 /* Main text color */ --text-secondary: #94a3b8
    /* Secondary text */ --text-muted: #64748b /* Muted text */
    --accent: #0ea5e9 /* Primary accent (Cyan) */ --accent-2: #fbbf24
    /* Secondary accent (Amber) */ --input-bg: rgba(255, 255, 255, 0.08)
    /* Input background */ --success: #10b981 /* Success color (Green) */
    --error: #ef4444 /* Error color (Red) */ --warning: #f59e0b
    /* Warning color (Orange) */;
```

#### Light Theme (`:root.light`)

```css
--bg: #ffffff /* White background */ --bg-secondary: #f8fafc
    /* Light gray background */ --bg-tertiary: #f1f5f9
    /* Lighter gray background */ --text-primary: #1e293b /* Dark text */
    --text-secondary: #475569 /* Medium gray text */ --text-muted: #94a3b8
    /* Light gray text */ --accent: #0284c7 /* Darker cyan */
    --accent-2: #d97706 /* Darker orange */ --input-bg: rgba(248, 250, 252, 1)
    /* Light input background */ --success: #059669 /* Darker green */
    --error: #dc2626 /* Darker red */ --warning: #ca8a04
    /* Darker orange/yellow */;
```

### 2. Theme Context

[ThemeContext.tsx](src/Context/ThemeContext.tsx) provides:

- Theme state management (light/dark)
- localStorage persistence
- System preference detection
- `useTheme()` hook for accessing theme in components

**Key Features:**

- Automatically detects system preference if no saved preference exists
- Saves preference to localStorage under "theme" key
- Updates document class (`dark` or `light`) for CSS variable switching
- Provides `toggleTheme()` function for theme switching

### 3. Component Updates

#### Header ([Header.tsx](src/Components/Header.tsx))

- Theme toggle button with sun/moon icons
- All elements use CSS variables for colors
- Proper contrast in both themes
- Settings and Logout buttons with theme-aware styling

#### UserList ([UserList.tsx](src/Components/UserList.tsx))

- Conversation list with theme-aware backgrounds and text
- Selected conversation highlighting with accent color
- Error messages with semantic colors
- "New message" badge with warning color

#### MessageItem ([MessageItem.tsx](src/Components/MessageItem.tsx))

- Sent messages (right side) use accent color
- Received messages use input background with borders
- Proper text contrast maintained

#### SearchBar ([SearchBar.tsx](src/Components/SearchBar.tsx))

- Theme-aware input styling
- Dropdown suggestions with hover effects
- Avatar circles with proper contrast
- Icon colors that adapt to theme

#### ConversationArea ([ConversationArea.tsx](src/Components/ConversationArea.tsx))

- Messages display with proper theme styling
- Date separators with theme-aware borders
- Send button with gradient and shadows
- Input field with theme variables

#### LoginPage ([LoginPage.tsx](src/Pages/LoginPage.tsx))

- Full theme support with CSS variables
- Form inputs with focus states
- Error messages in red
- Submit button with gradient
- Sign-up link styling

#### SignUpPage ([SignUpPage.tsx](src/Pages/SignUpPage.tsx))

- Same comprehensive theme implementation as LoginPage
- All form fields use CSS variables
- Validation error messages with proper colors
- Submit button with success-themed gradient

### 4. Global Styles

[main.css](src/main.css) includes:

- **Glass Panel Component**: `.glass-panel` with backdrop blur and proper theme colors
- **Form Elements**: Styled inputs, textareas with focus states
- **Scrollbars**: Custom webkit scrollbars matching theme
- **Animations**: Fade-in and slide-in animations
- **Selections**: Selection color that matches theme

## Color Palette

### Semantic Colors

| Color    | Dark Mode        | Light Mode            | Purpose                         |
| -------- | ---------------- | --------------------- | ------------------------------- |
| Accent   | #0ea5e9 (Cyan)   | #0284c7 (Dark Cyan)   | Primary UI element, links       |
| Accent-2 | #fbbf24 (Amber)  | #d97706 (Dark Orange) | Secondary accent, badges        |
| Success  | #10b981 (Green)  | #059669 (Dark Green)  | Success messages, online status |
| Error    | #ef4444 (Red)    | #dc2626 (Dark Red)    | Error messages, validation      |
| Warning  | #f59e0b (Orange) | #ca8a04 (Dark Orange) | Warnings, alerts                |

### Text Colors

| Level     | Dark Mode | Light Mode |
| --------- | --------- | ---------- |
| Primary   | #e2e8f0   | #1e293b    |
| Secondary | #94a3b8   | #475569    |
| Muted     | #64748b   | #94a3b8    |
| Disabled  | #475569   | #cbd5e1    |

### Background Colors

| Layer      | Dark Mode              | Light Mode          |
| ---------- | ---------------------- | ------------------- |
| Main       | #0b1021                | #ffffff             |
| Secondary  | #0f172a                | #f8fafc             |
| Tertiary   | #1a1f3a                | #f1f5f9             |
| Input      | rgba(255,255,255,0.08) | rgba(248,250,252,1) |
| Card Hover | rgba(255,255,255,0.15) | rgba(241,245,249,1) |

## Usage Instructions

### Switching Themes

Users can switch themes by clicking the theme toggle button in the header (sun/moon icon).

### For Developers

To use theme colors in a component:

```tsx
// Method 1: Using CSS variables inline
<div style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg)' }}>
  Content
</div>

// Method 2: Using CSS class
<div className="glass-panel">
  Content with glass effect
</div>

// Method 3: Using theme context
const { theme } = useTheme();
```

### Adding New Theme Colors

1. Add the variable to both `:root` and `:root.light` in [main.css](src/main.css)
2. Use the variable with `style={{ color: 'var(--your-new-color)' }}`

## Technical Implementation

### Theme Persistence

- Theme preference is saved to localStorage under the "theme" key
- On page reload, saved theme is restored
- If no saved preference, system preference is detected automatically

### CSS Variable Switching

- When theme changes, `ThemeContext` updates the document class
- `:root` selector applies dark theme variables
- `:root.light` selector applies light theme variables
- All components automatically reflect theme change

### Performance

- CSS variables provide zero-runtime overhead
- No re-rendering needed when theme changes (pure CSS update)
- Smooth transitions via CSS `transition` properties

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Variables supported in all evergreen browsers
- localStorage fallback for theme persistence

## Future Enhancements

- System theme auto-sync option
- Custom theme creation
- Theme scheduler (auto-switch at specific times)
- Per-component theme overrides
- Animation preferences consideration

## Files Modified

1. ✅ [src/Context/ThemeContext.tsx](src/Context/ThemeContext.tsx) - Theme state management
2. ✅ [src/main.css](src/main.css) - All CSS variables and global styles
3. ✅ [src/Components/Header.tsx](src/Components/Header.tsx)
4. ✅ [src/Components/UserList.tsx](src/Components/UserList.tsx)
5. ✅ [src/Components/MessageItem.tsx](src/Components/MessageItem.tsx)
6. ✅ [src/Components/SearchBar.tsx](src/Components/SearchBar.tsx)
7. ✅ [src/Components/ConversationArea.tsx](src/Components/ConversationArea.tsx)
8. ✅ [src/Pages/LoginPage.tsx](src/Pages/LoginPage.tsx)
9. ✅ [src/Pages/SignUpPage.tsx](src/Pages/SignUpPage.tsx)
