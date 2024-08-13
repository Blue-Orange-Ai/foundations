import React, {useEffect, useRef, useState} from "react";

import './Avatar.css';
import {AvatarEmpty} from "../avatarempty/AvatarEmpty";
import {AvatarImage} from "../avatarimage/AvatarImage";
import {Avatar as AvatarObj, GroupPermission, User} from "@Blue-Orange-Ai/foundations-clients/lib/Passport";
import {Button, ButtonType} from "../../buttons/button/Button";
import {FileUploadBtn} from "../../buttons/file-upload-btn/FileUploadBtn";
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";
import tippy from "tippy.js";
import blueOrangeMediaInstance from "../../config/BlueOrangeMediaConfig";
import {Modal} from "../../layouts/modal/modal/Modal";
import {ModalHeader} from "../../layouts/modal/modal-header/ModalHeader";
import {ModalDescription} from "../../layouts/modal/modal-description/ModalDescription";
import {ModalBody} from "../../layouts/modal/modal-body/ModalBody";
import {Media, Passport} from "@Blue-Orange-Ai/foundations-clients";
import passport from "../../config/BlueOrangePassportConfig";


interface Props {
	user: User;
	edit?: boolean;
	height?: number;
	width?:number; // Callback prop to send value to parent
	tooltip?:boolean
}

export const Avatar: React.FC<Props> = ({
											user,
											edit = false,
											height=80,
											width=80,
											tooltip = false
										}) => {


	const btnRef = useRef<HTMLDivElement | null>(null);

	const avatarModalElem = useRef<HTMLDivElement>(null);

	const [avatarModalState, setAvatarModalState] = useState(false);

	const [loading, setLoading] = useState(false);

	const [initialised, setInitialised] = useState(false);

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

	const forceCloseAvatarModal = () => {
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

	const getUserAvatarMedia = (user: User) => {
		if (workingUser.avatar) {
			blueOrangeMediaInstance.getUrlFromMediaId(workingUser.avatar.mediaId, 120, height).then(url => {
				if (workingUser.avatar) {
					workingUser.avatar.uri = url;
					setWorkingUser(workingUser);
				}
				setInitialised(true);
			}).catch(error => {
				setLoading(true);
			});
		}

	}

	const updateUserAvatar = (media: Media) => {
		if (workingUser.avatar) {
			workingUser.avatar.enabled = true;
			workingUser.avatar.mediaId = media.id as number;
			workingUser.avatar.uri = media.url
		} else {
			var avatar: AvatarObj = {
				enabled: true,
				mediaId: media.id as number,
				uri: media.url
			}
			workingUser.avatar = avatar;
		}
		setWorkingUser(workingUser);
		setUri(media.url)
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
			var avatar: AvatarObj = {
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
		try{
			setLoadingImageUrl(URL.createObjectURL(file));
		} catch (e) {}
		setLoading(true);
		setPercentageComplete(0);
		blueOrangeMediaInstance.uploadFile(
			file,
			false,
			"",
			[{
				groupName: "everyone",
				permission: GroupPermission.READ
			}],
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
		if (workingUser.avatar !== undefined) {
			setLoadingRemove(true);
			blueOrangeMediaInstance.deleteById(
				+workingUser.avatar.mediaId
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

	useEffect(() => {
		getUserAvatarMedia(user);
		const current = btnRef.current as TippyHTMLElement;
		if (current && tooltip) {
			tippy(current, {
				content: user.name,
			});
			return () => {
				const tippyInstance = current._tippy;
				if (tippyInstance) {
					tippyInstance.destroy();
				}
			};
		}
	}, []);

	return (
		<div ref={btnRef}>
			<div className="avatar-group-cont" style={scaleStyle}>
				{initialised &&
					<div className="default-avatar-cont" style={scaleStyle} onClick={openAvatarModal}>
						{(workingUser === undefined || !workingUser.avatar?.enabled) && <AvatarEmpty height={height}></AvatarEmpty>}
						{workingUser !== undefined && workingUser.avatar?.enabled &&
							<AvatarImage url={workingUser.avatar?.uri} height={height} width={height}></AvatarImage>
						}
					</div>
				}
				{edit &&
					<div className="avatar-edit-logo"
						 style={{'height': height * 0.25 + "px", 'width': width * 0.25 + "px", fontSize: height * 0.25 * 0.6}}>
						<i className="ri-camera-2-line"></i>
					</div>
				}
			</div>

			{ avatarModalState &&
				<Modal>
					<div ref={avatarModalElem} className="default-avatar-edit-card">
						<ModalHeader label={"Profile Picture"} onClose={forceCloseAvatarModal}></ModalHeader>
						<ModalDescription description={"A picture helps people recognize you and lets you know when you’re signed in to your account"}></ModalDescription>
						<ModalBody>
							<div className="default-avatar-modal-display">
								<div className="default-avatar-cont" style={defaultScaleStyle}>
									{(workingUser === undefined || workingUser.avatar === undefined || !workingUser.avatar.enabled) && !loading &&
										<AvatarEmpty height={defaultScaleSize}></AvatarEmpty>}
									{(workingUser !== undefined && workingUser.avatar !== undefined && workingUser.avatar.enabled) && !loading &&
										<AvatarImage url={workingUser.avatar?.uri} height={defaultScaleSize}
													 width={defaultScaleSize}></AvatarImage>}
									{loadingImageUrl === undefined && loading &&
										<AvatarEmpty height={defaultScaleSize}></AvatarEmpty>}
									{loadingImageUrl === undefined && loading &&
										<AvatarImage url={loadingImageUrl} height={defaultScaleSize}
													 width={defaultScaleSize}></AvatarImage>}
									{loading &&
										<div className="default-avatar-overlay">
											<span>{percentageComplete}%</span>
										</div>
									}
								</div>
							</div>
						</ModalBody>
						<div className="default-avatar-modify-btns">
							<FileUploadBtn label={"Upload Picture"} style={{width: "150px"}} accept={"image"}
										   onFileSelect={fileUploadRequestReceived} isLoading={loading}></FileUploadBtn>
							{workingUser !== undefined && workingUser.avatar && workingUser.avatar.enabled &&
								<div className="default-avatar-remove-btn">
									<Button text={"Remove Avatar"} style={{width: "150px"}}
											onClick={removeAvatarRequest} isLoading={loadingRemove}
											buttonType={ButtonType.PRIMARY}></Button>
								</div>
							}
						</div>
					</div>
				</Modal>
			}
		</div>
	);
};