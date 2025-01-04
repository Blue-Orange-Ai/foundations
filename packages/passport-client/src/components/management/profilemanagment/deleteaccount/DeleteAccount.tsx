import React, {useRef, useState} from "react";

import "./DeleteAccount.css"

import {DefaultInput} from "../../../utils/defaultinput/DefaultInput";
import Passport, {User} from "../../../utils/sdks/passport/Passport";
import {DefaultBtn} from "../../../utils/defaultbtn/DefaultBtn";
import {AvatarEmpty} from "../../../utils/avatar/avatarempty/AvatarEmpty";
import {AvatarImage} from "../../../utils/avatar/avatarimage/AvatarImage";
import {FileUploadBtn} from "../../../utils/fileuploadbtn/FileUploadBtn";

interface Props {
	user?: User
}

export const DeleteAccount: React.FC<Props> = ({user}) => {

	const [loading, setLoading] = useState(false);

	const [deleteModalState, setDeleteModalState] = useState(false);

	const deleteModalElem = useRef<HTMLDivElement>(null);

	const deleteAccount = () => {
		var passport = new Passport("http://localhost:8080");
		if (user != null && user.id != null) {
			passport.adminDeleteUser(user.id)
				.then(user => {
					setLoading(false);
				})
				.catch(error => {
					console.log(error)
					setLoading(false);
				});
		}
	}

	const closeDeleteModal = (e:React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (!isDescendantOf(deleteModalElem.current, target)) {
			setDeleteModalState(false);
		}
	};

	const forceCloseDeleteModal = (e:React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDeleteModalState(false);
	};

	const openDeleteModal = () => {
		setDeleteModalState(true)
	}

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

	return (
		<div className="passport-profile-main-page">
			<div className="passport-profile-main-page-cont">
				<h1 className="passport-profile-main-heading">Delete Account</h1>
				<p className="passport-default-body-text">This is a permanent action. Once an account is deleted you will not be able to recover it.</p>
				<div className="passport-profile-save-group">
					<DefaultBtn
						label="Delete Account" style={{width: "150px"}} isLoading={loading} onClick={openDeleteModal}></DefaultBtn>
				</div>
			</div>
			{ deleteModalState &&
				<div className="default-modal-backdrop" onClick={closeDeleteModal}>
					<div ref={deleteModalElem} className="delete-account-edit-card shadow">
						<div className="default-modal-close-btn" onClick={forceCloseDeleteModal}>
							<i className="ri-close-line"></i>
						</div>
						<h1>Are you sure?</h1>
						<p className="default-modal-description">Once you deleted you will not be able to recover your account.</p>
						<div className="default-modal-btns delete-account-modal-btn">
							<DefaultBtn
								label="Delete Account" style={{width: "150px"}} isLoading={loading} onClick={deleteAccount}></DefaultBtn>
						</div>
					</div>
				</div>
			}
		</div>

	)
}