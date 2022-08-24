import type { FacingMode } from '$lib/cameraPermissions';

export interface CameraControls {
	flash: 'on' | 'off' | 'not-available' | 'hide';
	flip: {
		facingMode: FacingMode;
		show: boolean;
	};
	timer: 'off' | '5s' | '10s';
}

export type UploadStatus = 'to-upload' | 'uploading' | 'uploaded';
