# PyThoughts - Design System & UI Guidelines

## 🎨 Design Philosophy

PyThoughts embraces a **Python-centric design language** that celebrates the elegance and simplicity of Python while maintaining modern web design principles. The design system combines technical professionalism with playful Python-themed elements.

### Core Principles
1. **Python-First**: Visual language inspired by Python syntax and culture
2. **Developer-Friendly**: Interfaces that resonate with programmers
3. **Accessible**: WCAG 2.1 AA compliance for inclusive design
4. **Responsive**: Mobile-first approach with seamless scaling
5. **Performance-Oriented**: Optimized for fast loading and smooth interactions

## 🌈 Color System

### Primary Palette (Python-Inspired)
```css
/* Python Blue - Primary Brand Color */
--python-blue: #3776ab
--python-blue-dark: #2c5d84
--python-blue-light: #5094d4

/* Python Gold - Accent Color */
--python-gold: #ffd43b
--python-gold-dark: #d4b32f
--python-gold-light: #ffe066

/* Semantic Colors */
--success: #10b981    /* Green for positive actions */
--warning: #f59e0b    /* Amber for warnings */
--error: #ef4444      /* Red for errors */
--info: #3b82f6       /* Blue for information */
```

### Neutral Palette
```css
/* Dark Theme (Primary) */
--background: 0 0% 3.9%           /* #0a0a0a */
--foreground: 0 0% 98%            /* #fafafa */
--card: 0 0% 3.9%                 /* #0a0a0a */
--card-foreground: 0 0% 98%       /* #fafafa */
--popover: 0 0% 3.9%              /* #0a0a0a */
--popover-foreground: 0 0% 98%    /* #fafafa */
--primary: 0 0% 98%               /* #fafafa */
--primary-foreground: 0 0% 9%     /* #171717 */
--secondary: 0 0% 14.9%           /* #262626 */
--secondary-foreground: 0 0% 98%  /* #fafafa */
--muted: 0 0% 14.9%               /* #262626 */
--muted-foreground: 0 0% 63.9%    /* #a3a3a3 */
--accent: 0 0% 14.9%              /* #262626 */
--accent-foreground: 0 0% 98%     /* #fafafa */
--destructive: 0 62.8% 30.6%      /* #7c2d12 */
--destructive-foreground: 0 0% 98% /* #fafafa */
--border: 0 0% 14.9%              /* #262626 */
--input: 0 0% 14.9%               /* #262626 */
--ring: 0 0% 83.1%                /* #d4d4d8 */
```

## 🔤 Typography

### Font Stack
```css
font-family: 
  "Inter", 
  -apple-system, 
  BlinkMacSystemFont, 
  "Segoe UI", 
  Roboto, 
  sans-serif;
```

### Type Scale
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* h1 */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* h2 */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* h3 */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* h4 */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* h5 */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* body */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* small */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* caption */

/* Code Text */
font-family: 
  "JetBrains Mono", 
  "Fira Code", 
  "Source Code Pro", 
  Menlo, 
  monospace;
```

### Font Weights
- **300**: Light (rare usage)
- **400**: Regular (body text)
- **500**: Medium (emphasis)
- **600**: Semibold (headings)
- **700**: Bold (strong emphasis)

## 🎭 Component Library

### Button Variants
```tsx
// Primary - Main actions
<Button variant="default">Get Started</Button>

// Secondary - Secondary actions
<Button variant="secondary">Learn More</Button>

// Destructive - Delete/Remove actions
<Button variant="destructive">Delete Post</Button>

// Outline - Alternative actions
<Button variant="outline">Cancel</Button>

// Ghost - Subtle actions
<Button variant="ghost">Skip</Button>

// Link - Text-like actions
<Button variant="link">View Profile</Button>
```

### Card Components
```tsx
// Standard card with Python theme
<Card className="bg-gradient-to-br from-background to-secondary border-python-blue/20">
  <CardHeader>
    <CardTitle className="text-python-blue">Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>

// Post card with enhanced styling
<Card className="post-card">
  <PostCardHeader />
  <PostCardContent />
  <PostCardActions />
</Card>
```

### Form Elements
```tsx
// Input with Python theme
<Input 
  className="border-python-blue/30 focus:border-python-blue" 
  placeholder="Enter your code..."
/>

// Textarea for code
<Textarea 
  className="font-mono bg-secondary border-python-blue/20"
  placeholder="# Write your Python code here..."
/>

// Select with custom styling
<Select>
  <SelectTrigger className="border-python-blue/30">
    <SelectValue placeholder="Select language" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="python">Python</SelectItem>
  </SelectContent>
</Select>
```

## ✨ Animation System

### Custom Keyframes
```css
/* Python-themed animations */
@keyframes snake-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  75% { transform: rotate(-1deg); }
}

@keyframes bounce-in {
  0% { 
    transform: scale(0.8) translateY(20px); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.05) translateY(-5px); 
    opacity: 0.8; 
  }
  100% { 
    transform: scale(1) translateY(0); 
    opacity: 1; 
  }
}

@keyframes python-glow {
  0%, 100% { 
    box-shadow: 0 0 10px rgba(55, 118, 171, 0.3); 
  }
  50% { 
    box-shadow: 0 0 20px rgba(55, 118, 171, 0.6); 
  }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Animation Classes
```css
/* Hover effects */
.hover-glow:hover {
  animation: python-glow 2s ease-in-out infinite;
}

.hover-bounce:hover {
  animation: bounce-in 0.6s ease-out;
}

/* Loading animations */
.snake-wiggle {
  animation: snake-wiggle 2s ease-in-out infinite;
}

/* Gradient background */
.gradient-animate {
  background: linear-gradient(-45deg, #3776ab, #ffd43b, #2c5d84, #ffe066);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices (phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* Ultra wide screens */
```

### Layout Patterns
```tsx
// Responsive grid for posts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map(post => <PostCard key={post.id} {...post} />)}
</div>

// Sidebar layout
<div className="flex flex-col lg:flex-row gap-8">
  <main className="flex-1">
    <Feed />
  </main>
  <aside className="w-full lg:w-80">
    <ChatSidebar />
  </aside>
</div>
```

### Mobile Optimizations
- Touch targets minimum 44px
- Thumb-friendly navigation
- Swipe gestures for interactions
- Optimized tap areas

## 🎯 Icon System

### Primary Icons (Lucide React)
```tsx
// Navigation
<Home className="w-5 h-5" />
<Search className="w-5 h-5" />
<Bell className="w-5 h-5" />
<User className="w-5 h-5" />

// Actions
<Heart className="w-4 h-4" />
<MessageCircle className="w-4 h-4" />
<Share2 className="w-4 h-4" />
<Bookmark className="w-4 h-4" />

// Python-specific
<Code2 className="w-5 h-5 text-python-blue" />
<Terminal className="w-5 h-5" />
<Zap className="w-4 h-4 text-python-gold" />
```

### Custom Python Logo
```tsx
// Scalable Python logo component
const PythonLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#3776ab" d="M12 0C8.5 0 5.5 1.5 5.5 4v4h7v1H4c-2.2 0-4 1.8-4 4s1.8 4 4 4h2v-3c0-2.2 1.8-4 4-4h7c2.2 0 4-1.8 4-4V4c0-2.5-3-4-6.5-4H12z"/>
    <path fill="#ffd43b" d="M12 24c3.5 0 6.5-1.5 6.5-4v-4h-7v-1h8.5c2.2 0 4-1.8 4-4s-1.8-4-4-4H18v3c0 2.2-1.8 4-4 4H7c-2.2 0-4 1.8-4 4v4c0 2.5 3 4 6.5 4H12z"/>
  </svg>
)
```

## 🏗️ Layout Components

### Page Layout
```tsx
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
)
```

### Content Layouts
```tsx
// Two-column layout
const TwoColumnLayout = ({ main, sidebar }) => (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <main className="lg:col-span-3">{main}</main>
    <aside className="lg:col-span-1">{sidebar}</aside>
  </div>
)

// Three-column layout
const ThreeColumnLayout = ({ left, main, right }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <aside className="lg:col-span-2">{left}</aside>
    <main className="lg:col-span-8">{main}</main>
    <aside className="lg:col-span-2">{right}</aside>
  </div>
)
```

## 🎨 Design Tokens

### Spacing Scale
```css
0: 0px      /* No space */
1: 0.25rem  /* 4px */
2: 0.5rem   /* 8px */
3: 0.75rem  /* 12px */
4: 1rem     /* 16px */
6: 1.5rem   /* 24px */
8: 2rem     /* 32px */
12: 3rem    /* 48px */
16: 4rem    /* 64px */
20: 5rem    /* 80px */
24: 6rem    /* 96px */
```

### Border Radius
```css
none: 0px
sm: 0.125rem    /* 2px */
DEFAULT: 0.25rem /* 4px */
md: 0.375rem    /* 6px */
lg: 0.5rem      /* 8px */
xl: 0.75rem     /* 12px */
2xl: 1rem       /* 16px */
3xl: 1.5rem     /* 24px */
full: 9999px    /* Full circle */
```

### Shadow System
```css
/* Card shadows with Python theme */
.shadow-python-sm {
  box-shadow: 0 1px 3px rgba(55, 118, 171, 0.1);
}

.shadow-python {
  box-shadow: 0 4px 6px rgba(55, 118, 171, 0.15);
}

.shadow-python-lg {
  box-shadow: 0 10px 15px rgba(55, 118, 171, 0.2);
}

.shadow-python-xl {
  box-shadow: 0 20px 25px rgba(55, 118, 171, 0.25);
}
```

## 📐 Component Specifications

### Post Card
- **Width**: Fluid with max-width constraints
- **Padding**: 24px (desktop), 16px (mobile)
- **Border**: 1px solid border color with Python blue accent
- **Border Radius**: 12px
- **Background**: Gradient from background to secondary

### Chat Message
- **User Messages**: Right-aligned, Python blue background
- **AI Messages**: Left-aligned, secondary background
- **Max Width**: 70% of container
- **Padding**: 12px 16px
- **Border Radius**: 16px (speech bubble style)

### Navigation Header
- **Height**: 64px
- **Background**: Semi-transparent with backdrop blur
- **Sticky**: Fixed to top on scroll
- **Logo**: 32px Python logo with brand text
- **Search**: Expandable search bar with Python blue focus

## 🎭 Dark Theme Considerations

The design system is **dark-first** with careful attention to:
- **Contrast Ratios**: Minimum 4.5:1 for normal text
- **Python Blue**: Adjusted for dark backgrounds
- **Code Syntax**: High contrast for code readability
- **Shadows**: Subtle shadows that work on dark surfaces
- **Borders**: Visible but not harsh borders

## 📋 Design System Checklist

### Component Creation
- [ ] Follows established color palette
- [ ] Uses consistent spacing scale
- [ ] Implements proper typography hierarchy
- [ ] Includes hover and focus states
- [ ] Supports keyboard navigation
- [ ] Works across all breakpoints
- [ ] Maintains Python theme consistency
- [ ] Includes proper ARIA labels

### Accessibility Standards
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus indicators visible
- [ ] Touch targets minimum 44px
- [ ] Alternative text for images
- [ ] Semantic HTML structure

---

*This design system evolves with the product while maintaining consistency and Python-centric identity.*