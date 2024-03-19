import React, {useRef, useState} from "react";
import {Media, Passport} from "@blue-orange-ai/foundations-clients";

import './Avatar.css';
import {AvatarEmpty} from "../avatarempty/AvatarEmpty";
import {AvatarImage} from "../avatarimage/AvatarImage";
import {PassportAvatar, User} from "@blue-orange-ai/foundations-clients/lib/Passport";
import {BlueOrangeMedia} from "@blue-orange-ai/foundations-clients/lib/BlueOrangeMedia";
import {Button, ButtonType} from "../../buttons/button/Button";
import {FileUploadBtn} from "../../buttons/fileuploadbtn/FileUploadBtn";


interface Props {
	user: User;
	edit?: boolean;
	height?: number;
	width?:number; // Callback prop to send value to parent
}

export const Avatar: React.FC<Props> = ({
											user,
											edit = false,
											height=80,
											width=80}) => {


	const avatarModalElem = useRef<HTMLDivElement>(null);

	const [avatarModalState, setAvatarModalState] = useState(false);

	const [loading, setLoading] = useState(false);

	const [loadingRemove, setLoadingRemove] = useState(false);

	const [loadingImageUrl, setLoadingImageUrl] = useState("");

	const [percentageComplete, setPercentageComplete] = useState(0);

	const [workingUser, setWorkingUser] = useState(JSON.parse(JSON.stringify(user)) as User);

	const [uri, setUri] = useState("");

	const scaleStyle: React.CSSProperties = {
		height: height + "px",
		maxHeight: height + "px",
		width: width + "px",
		maxWidth: width + "px",
		cursor: edit ? "pointer" : "unset"
	}

	const defaultScaleSize = 120;

	const defaultScaleStyle: React.CSSProperties = {
		height: defaultScaleSize + "px",
		maxHeight: defaultScaleSize + "px",
		width: defaultScaleSize + "px",
		maxWidth: defaultScaleSize + "px"
	}

	const openAvatarModal = (e:React.MouseEvent<HTMLDivElement>) => {
		if (edit) {
			setAvatarModalState(true);
		}
	};

	const closeAvatarModal = (e:React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (edit && !isDescendantOf(avatarModalElem.current, target)) {
			setAvatarModalState(false);
		}
	};

	const forceCloseAvatarModal = (e:React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		setAvatarModalState(false);
	};

	const isDescendantOf = (parent:HTMLElement | null, child:HTMLElement | null) =>{
		if (parent && child) {
			if (parent === child) {
				return child
			}
			try{
				var node = child.parentElement;
				while (node != null){
					if (node === parent){
						return node;
					}
					node = node.parentElement;
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	const onUploadProgress = (percentageComplete: number) => {
		setPercentageComplete(percentageComplete);
	}

	const updateUserAvatar = (media: Media) => {
		if (workingUser.avatar) {
			workingUser.avatar.enabled = true;
			workingUser.avatar.mediaId = media.id as number;
			workingUser.avatar.uri = media.url
		} else {
			var avatar: PassportAvatar = {
				enabled: true,
				mediaId: media.id as number,
				uri: media.url
			}
			workingUser.avatar = avatar;
		}
		setWorkingUser(workingUser);
		setUri(media.url)
		var passport = new Passport("http://localhost:8080");
		passport.save(workingUser)
			.then(savedUser => {
				setWorkingUser(savedUser);
			})
			.catch(error => {
				setLoading(false);
				setWorkingUser(user);
			});
	}

	const removeUserAvatar = () => {
		if (workingUser.avatar) {
			workingUser.avatar.enabled = false;
			workingUser.avatar.mediaId = -1;
			workingUser.avatar.uri = "";
		} else {
			var avatar: PassportAvatar = {
				enabled: false,
				mediaId: -1,
				uri: ""
			}
			workingUser.avatar = avatar;
		}
		setWorkingUser(workingUser);
		setUri("");
	}

	const fileUploadRequestReceived = (file: File) => {
		var bom = new BlueOrangeMedia("http://localhost:8086");
		try{
			setLoadingImageUrl(URL.createObjectURL(file));
		} catch (e) {}
		setLoading(true);
		setPercentageComplete(0);
		bom.uploadFile(
			file,
			true,
			"",
			[],
			onUploadProgress)
			.then(mediaObject => {
				setLoading(false);
				updateUserAvatar(mediaObject);
			})
			.catch(error => {
				setLoading(false);
			});

	}

	const removeAvatarRequest = () => {
		var bom = new BlueOrangeMedia("http://localhost:8086");
		if (workingUser.avatar !== undefined) {
			setLoadingRemove(true);
			bom.deleteById(
				workingUser.avatar.mediaId
			)
				.then(response => {
					setLoadingRemove(false);
					removeUserAvatar()
				})
				.catch(error => {
					setLoadingRemove(false);
					console.error(error)
					removeUserAvatar()
				});
		} else {
			removeUserAvatar();
		}
	}

	return (
		<div>
			<div className="avatar-group-cont" style={scaleStyle}>
				<div className="default-avatar-cont" style={scaleStyle} onClick={openAvatarModal}>
					{(workingUser === undefined || !workingUser.avatar?.enabled) && <AvatarEmpty height={height}></AvatarEmpty>}
					{workingUser !== undefined && workingUser.avatar?.enabled &&
						<AvatarImage url={workingUser.avatar?.uri} height={height} width={height}></AvatarImage>
					}
				</div>
				{edit &&
					<div className="avatar-edit-logo"
						 style={{'height': height * 0.25 + "px", 'width': width * 0.25 + "px", fontSize: height * 0.25 * 0.6}}>
						<i className="ri-camera-2-line"></i>
					</div>
				}
			</div>

			{ avatarModalState &&
				<div className="default-modal-backdrop" onClick={closeAvatarModal}>
					<div ref={avatarModalElem} className="default-avatar-edit-card shadow">
						<div className="default-modal-close-btn" onClick={forceCloseAvatarModal}>
							<i className="ri-close-line"></i>
						</div>
						<h1>Profile Picture</h1>
						<p className="default-avatar-modal-description">A picture helps people recognize you and lets you know when you’re signed in to your account</p>
						<div className="default-avatar-modal-display">
							<div className="default-avatar-cont" style={defaultScaleStyle}>
								{(workingUser === undefined || workingUser.avatar === undefined || !workingUser.avatar.enabled) && !loading && <AvatarEmpty height={defaultScaleSize}></AvatarEmpty>}
								{(workingUser !== undefined && workingUser.avatar !== undefined && workingUser.avatar.enabled) && !loading &&
									<AvatarImage url={workingUser.avatar?.uri} height={defaultScaleSize} width={defaultScaleSize}></AvatarImage>}
								{loadingImageUrl === undefined && loading && <AvatarEmpty height={defaultScaleSize}></AvatarEmpty>}
								{loadingImageUrl === undefined && loading && <AvatarImage url={loadingImageUrl} height={defaultScaleSize} width={defaultScaleSize}></AvatarImage>}
								{loading &&
									<div className="default-avatar-overlay">
										<span>{percentageComplete}%</span>
									</div>
								}
							</div>
						</div>
						<div className="default-avatar-modify-btns">
							<FileUploadBtn label={"Upload Picture"} style={{width: "150px"}} accept={"image"} onFileSelect={fileUploadRequestReceived} isLoading={loading}></FileUploadBtn>
							{workingUser !== undefined && workingUser.avatar && workingUser.avatar.enabled &&
								<div className="default-avatar-remove-btn">
									<Button text={"Remove Avatar"} style={{width: "150px"}} onClick={removeAvatarRequest} isLoading={loadingRemove} buttonType={ButtonType.PRIMARY}></Button>
								</div>
							}
						</div>
					</div>
				</div>
			}
		</div>
	);
};