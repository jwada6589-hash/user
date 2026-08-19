import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const javaExecutable = isWindows ? 'java.exe' : 'java';
const gradleWrapper = isWindows ? 'gradlew.bat' : './gradlew';
const candidates = [
  process.env.JAVA_HOME,
  isWindows ? 'C:\\Program Files\\Android\\Android Studio\\jbr' : undefined,
  process.platform === 'darwin' ? '/Applications/Android Studio.app/Contents/jbr/Contents/Home' : undefined,
].filter(Boolean);

const javaHome = candidates.find((candidate) => {
  const executable = join(candidate, 'bin', javaExecutable);
  if (!existsSync(executable)) return false;
  const version = spawnSync(executable, ['-version'], { encoding: 'utf8' });
  const output = `${version.stdout ?? ''}${version.stderr ?? ''}`;
  const match = output.match(/version "(\d+)/);
  return match && Number(match[1]) >= 21;
});

if (!javaHome) {
  console.error('Android build requires Java 21+. Install Android Studio or set JAVA_HOME to a JDK 21 installation.');
  process.exit(1);
}

const result = spawnSync(gradleWrapper, ['assembleDebug'], {
  cwd: new URL('../android/', import.meta.url),
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    JAVA_HOME: javaHome,
    PATH: `${join(javaHome, 'bin')}${delimiter}${process.env.PATH ?? ''}`,
  },
});

process.exit(result.status ?? 1);
