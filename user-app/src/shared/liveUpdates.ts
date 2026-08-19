import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

let startupCheckStarted = false;

async function checkOnceAndQueueUpdate() {
  // This must happen before network/data initialization. A bundle that cannot
  // reach this call is automatically rolled back by the native updater.
  await CapacitorUpdater.notifyAppReady();

  // Avoid downloading the same candidate twice if it is already waiting for
  // the next background/launch transition.
  const pendingBundle = await CapacitorUpdater.getNextBundle();
  if (pendingBundle) return;

  const latest = await CapacitorUpdater.getLatest();
  if (latest.kind === 'up_to_date' || latest.kind === 'blocked' || latest.error) return;

  // Native-incompatible bundles must be delivered in a new APK/AAB instead.
  if (latest.breaking || latest.major || !latest.url || !latest.version) return;

  const bundle = await CapacitorUpdater.download({
    url: latest.url,
    version: latest.version,
    checksum: latest.checksum,
    sessionKey: latest.sessionKey,
    manifest: latest.manifest,
  });

  // Queue only. The current session remains untouched; the new bundle becomes
  // active after the app leaves the foreground and is shown on the next open.
  await CapacitorUpdater.next({ id: bundle.id });
}

export function startLiveUpdateCheck() {
  if (!Capacitor.isNativePlatform() || startupCheckStarted) return;
  startupCheckStarted = true;

  // Updating is deliberately best-effort and never blocks normal app startup.
  void checkOnceAndQueueUpdate().catch(() => undefined);
}
