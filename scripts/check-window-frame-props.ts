/**
 * This script checks all components that use WindowFrame to ensure they provide all required props.
 * Run with: npx ts-node scripts/check-window-frame-props.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const componentsDir = path.join(__dirname, '../src/components');

// Required props for WindowFrame
const requiredProps = [
  'isOpen',
  'onClose',
  'isMaximized',
  'isMinimized',
  'defaultSize',
  'defaultPosition'
];

// Optional props
const optionalProps = [
  'onMinimize',
  'onMaximize',
  'isFullScreen',
  'title',
  'icon',
  'children'
];

function checkFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file uses WindowFrame
  if (content.includes('<WindowFrame')) {
    console.log(`Checking ${path.basename(filePath)}...`);
    
    // Check for each required prop
    const missingProps = requiredProps.filter(prop => !content.includes(prop));
    
    if (missingProps.length > 0) {
      console.error(`❌ ${path.basename(filePath)} is missing required props: ${missingProps.join(', ')}`);
    } else {
      console.log(`✅ ${path.basename(filePath)} has all required props`);
    }
    
    // Check for state variables
    const hasIsMaximizedState = content.includes('const [isMaximized, setIsMaximized] = useState');
    const hasIsMinimizedState = content.includes('const [isMinimized, setIsMinimized] = useState');
    
    if (!hasIsMaximizedState) {
      console.warn(`⚠️ ${path.basename(filePath)} might be missing isMaximized state`);
    }
    
    if (!hasIsMinimizedState) {
      console.warn(`⚠️ ${path.basename(filePath)} might be missing isMinimized state`);
    }
  }
}

function scanDirectory(dir: string): void {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      checkFile(filePath);
    }
  }
}

console.log('Checking components for WindowFrame props...');
scanDirectory(componentsDir);
console.log('Done!'); 