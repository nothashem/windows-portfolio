# Windows Portfolio

A web-based operating system experience built with Next.js, React, and TypeScript. This project simulates a Windows-like desktop environment in the browser, complete with functional applications, window management, and system sounds.

Hashim OS

## Features

- 🖥️ Realistic desktop environment with window management
- 🌐 Functional web browser with navigation, bookmarks, and URL handling
- 📝 Notepad application with save functionality
- 📊 Excel-like spreadsheet with formula support
- 🎵 Music player application
- 🖱️ Custom cursor effects for different interactions
- 🔊 System sounds for various actions
- 🔄 Window controls (minimize, maximize, close)
- 🌙 Light/dark mode support

## Applications

### Web Browser
- Navigation with back/forward buttons
- URL bar with secure connection indicator
- Bookmarks bar with customizable shortcuts
- Loading indicators
- Simulated checkout experience

### Notepad
- Create and edit text documents
- Auto-save functionality
- Document naming based on content

### Excel
- Spreadsheet with cell editing
- Formula support
- Financial modeling templates

### Music Player
- Audio playback controls
- Playlist management

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Three Fiber** - 3D effects
- **React Icons** - Icon library
- **use-sound** - Audio management

## Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/windows-portfolio.git
   cd windows-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

.
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
└── ...

## Customization

### Changing the Wallpaper
Replace the `public/wallpaper.jpg` file with your preferred image.

### Adding Bookmarks
Edit the `DEFAULT_BOOKMARKS` array in `src/components/Browser.tsx`:
```typescript
const DEFAULT_BOOKMARKS = [
  { name: "GitHub", url: "https://github.com" },
  { name: "Portfolio", url: "https://yourportfolio.com" },
  // Add more bookmarks here
];
```

## Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Windows operating system
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Sound effects from [use-sound](https://github.com/joshwcomeau/use-sound)
