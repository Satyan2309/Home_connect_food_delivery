const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldRebuild = args.includes('--rebuild');
const devMode = args.includes('--dev');

// Function to start the application
function startApp() {
  if (devMode) {
    // In development mode, start both frontend and backend servers
    startDevMode();
  } else {
    // In production mode, build frontend and serve from backend
    startProductionMode();
  }
}

// Function to start in development mode (separate servers)
function startDevMode() {
  console.log('Starting application in development mode...');
  
  // Start backend server
  const backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });
  
  console.log('Backend server started on port 7071');
  console.log('Access the API at: http://localhost:7071/api');
  
  // Start frontend development server
  const frontendProcess = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });
  
  console.log('Frontend development server started on port 7070');
  console.log('Access the application at: http://localhost:7070');
  
  // Handle process termination
  process.on('SIGINT', () => {
    backendProcess.kill();
    frontendProcess.kill();
    process.exit();
  });
}

// Function to start in production mode (backend serves frontend)
function startProductionMode() {
  // Check if frontend build exists
  const buildDir = path.join(frontendDir, 'build');
  if (!fs.existsSync(buildDir) || shouldRebuild) {
    console.log('Building frontend application...');
    
    // Run npm build in frontend directory
    const buildProcess = spawn('npm', ['run', 'build'], {
      cwd: frontendDir,
      stdio: 'inherit',
      shell: true
    });
    
    buildProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Frontend build process exited with code ${code}`);
        return;
      }
      console.log('Frontend build completed successfully');
      startBackend();
    });
  } else {
    console.log('Frontend build already exists. Starting server...');
    startBackend();
  }
}

function startBackend() {
  console.log('Starting backend server...');
  
  // Start the backend server
  const serverProcess = spawn('node', ['server.js'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });
  
  console.log('Server started on port 7071');
  console.log('Access the application at: http://localhost:7071');
  
  serverProcess.on('close', (code) => {
    console.log(`Backend server process exited with code ${code}`);
  });
}

// Start the application
startApp();