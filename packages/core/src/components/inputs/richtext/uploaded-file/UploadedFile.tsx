import React, {useEffect, useRef, useState} from "react";

import './UploadedFile.css'
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";
import {Media} from "@blue-orange-ai/foundations-clients";
import {SimpleMetric} from "../../../metrics/simple-metric/SimpleMetric";
import blueOrangeMediaInstance from "../../../config/BlueOrangeMediaConfig";
import {GroupPermission} from "@blue-orange-ai/foundations-clients";
import {MediaPermission} from "@blue-orange-ai/foundations-clients";

export interface RichTextEditorUploadedFile {
	uuid: string,
	uploaded: boolean,
	media: Media | undefined,
	file?: File,
}

interface Props {
	upload: RichTextEditorUploadedFile,
	uploadPermissions?: Array<MediaPermission>,
	onMediaUploaded?: (media: Media) => void,
	onRemove?: (upload: RichTextEditorUploadedFile) => void,
	onError?: (upload: RichTextEditorUploadedFile) => void,
}

const defaultUploadPermission: MediaPermission[] = [{
	groupName: "everyone",
	permission: GroupPermission.READ
}]

export const UploadedFile: React.FC<Props> = ({
												  upload,
												  uploadPermissions=defaultUploadPermission,
												  onMediaUploaded,
												  onRemove,
												  onError}) => {

	const initFilename = () => {
		if (upload.uploaded && upload.media) {
			return media?.filename;
		} else if (upload.file) {
			return upload.file.name
		}
		return "Unknown filename";
	}

	const [uploadPercentage, setUploadPercentage] = useState(0);

	const [media, setMedia] = useState(upload.media);

	const [uploaded, setUploaded] = useState(upload.uploaded);

	const [errored, setErrored] = useState(false);

	const [filename, setFilename] = useState(initFilename());

	const uploadStarted = useRef(false);

	const downloadFile = (filename: string, url: string) => {
		const link = document.createElement('a');
		link.href = url;
		// @ts-ignore
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	const downloadMedia = (media: Media | undefined) => {
		if (media && media.id && uploaded && !errored) {
			blueOrangeMediaInstance.getUrlFromMediaId(media.id as number).then(url => {
				downloadFile(media.filename, url);
			}).catch(error => {
				console.error(error);
			});
		}
	}

	const mediaUploaded = (media: Media) => {
		setUploaded(true);
		setFilename(media.filename);
		setUploadPercentage(0);
		setMedia(media);
		if (onMediaUploaded) {
			onMediaUploaded(media);
		}
	}

	const uploadError = () => {
		setErrored(true);
		if (onError) {
			onError(upload);
		}
	}

	const onUploadProgress = (percentageComplete: number) => {
		setUploadPercentage(percentageComplete);
	}

	const removeMedia = () => {
		if (media) {
			blueOrangeMediaInstance.delete(media)
				.then(() => {
					if (onRemove) {
						onRemove(upload);
					}
				})
		}
	}

	useEffect(() => {
		if (!uploadStarted.current && !upload.uploaded && upload.file) {
			setErrored(false);
			setUploadPercentage(0);
			blueOrangeMediaInstance.uploadFile(
				upload.file,
				false,
				"",
				uploadPermissions,
				onUploadProgress)
				.then(mediaObject => {
					mediaUploaded(mediaObject);
				})
				.catch(error => {
					console.error(error);
					uploadError();
				});
		}
	}, []);

	return (
		<div className={errored ? "blue-orange-rich-text-editor-uploaded-file-cont blue-orange-rich-text-editor-uploaded-errored" : "blue-orange-rich-text-editor-uploaded-file-cont"}>
			<div className="blue-orange-rich-text-editor-uploaded-file-left-cont" onClick={() => {downloadMedia(media)}}>
				<div className="blue-orange-rich-text-editor-uploaded-file-name">{filename}</div>
			</div>
			<div className="blue-orange-rich-text-editor-uploaded-file-right-cont">
				{(uploaded || errored) && <ButtonIcon icon={"ri-close-line"} style={{backgroundColor: "white"}} onClick={removeMedia}></ButtonIcon>}
				{!uploaded && !errored && <SimpleMetric text={uploadPercentage + "%"} style={{backgroundColor: "white"}}></SimpleMetric>}
			</div>
		</div>
	)
}