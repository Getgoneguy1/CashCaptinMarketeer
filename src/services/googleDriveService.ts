/**
 * Google Drive Backup Service for Cash Captain Marketeer™
 * Uploads project backup archives directly to Ty Birchfield's Google Drive (tybirchfield42@gmail.com)
 */

export const uploadBackupToGoogleDrive = async (
  accessToken: string,
  fileName = 'cashcaptain_marketeer_backup.tar.gz',
  fileBlob?: Blob
): Promise<{ success: boolean; fileId?: string; message: string }> => {
  try {
    let blob = fileBlob;
    if (!blob) {
      // Fetch current backup tarball from public assets
      const res = await fetch('/cashcaptain_marketeer_backup.tar.gz');
      if (!res.ok) {
        throw new Error('Failed to retrieve backup archive from server');
      }
      blob = await res.blob();
    }

    const metadata = {
      name: fileName,
      mimeType: 'application/gzip',
      description: 'Automated full system backup for Cash Captain Marketeer™ (Y.W.G.T Online! / Virbis.com LLC)'
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', blob);

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: form
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Google Drive API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    return {
      success: true,
      fileId: data.id,
      message: `Successfully uploaded ${fileName} to your Google Drive (ID: ${data.id})!`
    };
  } catch (error: any) {
    console.error('Google Drive backup upload failed', error);
    return {
      success: false,
      message: error.message || 'Failed to upload backup to Google Drive'
    };
  }
};
