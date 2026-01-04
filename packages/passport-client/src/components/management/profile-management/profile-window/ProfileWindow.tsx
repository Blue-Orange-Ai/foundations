import React, {useEffect, useRef, useState} from "react";

import "./ProfileWindow.css"

import {useLocation, useNavigate, useParams} from "react-router-dom";
import {User} from "@blue-orange-ai/foundations-clients";
import {usePassport} from "../../../providers/PassportProvider";
import {Avatar, Loading} from "@blue-orange-ai/foundations-core";
import {BasicInformation} from "../basic-information/BasicInformation";
import {ResetPassword} from "../reset-password/ResetPassword";
import {DeleteAccount} from "../delete-account/DeleteAccount";
import {UserGroups} from "../user-groups/UserGroups";
import {ProfileAdmin} from "../profile-admin/ProfileAdmin";

interface Props {
}

export const ProfileWindow: React.FC<Props> = ({}) => {

	const passport = usePassport();

	const isInitialMount = useRef(true);

	const navigate = useNavigate();

	const location = useLocation();

	const { userId } = useParams();

	const [loading, setLoading] = useState(true);

	const [tabState, setTabState] = useState("basic");

	const [user, setUser] = useState<User>();

	const updateQueryParams = (newParams: Record<string, string>) => {
		const searchParams = new URLSearchParams(location.search);
		Object.keys(newParams).forEach(key => {
			searchParams.set(key, newParams[key]);
		});
		navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
	};

	const getQueryParamValue = (param: string): string | null => {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.get(param);
	};

	const clickTab = (tab: string) => {
		setTabState(tab);
		updateQueryParams({"t": tab});
	}

	const initTab = () => {
		var q = getQueryParamValue("t");
		if (q === null) {
			setTabState("basic")
		} else if (q.toLowerCase() === "groups") {
			setTabState("groups")
		} else if (q.toLowerCase() === "reset") {
			setTabState("reset")
		} else if (q.toLowerCase() === "delete") {
			setTabState("delete")
		} else if (q.toLowerCase() === "admin") {
			setTabState("admin")
		}
	}

	const getTabClassName = (tab: string) => {
		if (tab === tabState) {
			return "passport-profile-header-tab passport-profile-header-tab-active"
		} else {
			return "passport-profile-header-tab"
		}
	}

	const getUser = (userId: string) => {
		passport.get(userId)
			.then(user => {
				setUser(user);
				setLoading(false);
			})
			.catch(error => {
				console.log(error)
				setLoading(false);
			});
	}

	const reloadUser = () => {
		getUser(userId === undefined ? "" : userId);
	}

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			initTab();
			setLoading(true);
			getUser(userId === undefined ? "" : userId)
		}
		return () => {

		};
	}, []);

	return (
		<div>
			{loading &&
				<div className="passport-profile-window-loading">
					<Loading fontSize="6rem" color="#b0b0b0"></Loading>
				</div>
			}
			{!loading && user !== undefined &&
				<div className="passport-profile-page-management">
					<div className="passport-header-profile">
						<Avatar user={user} height={100} width={100} edit={true}></Avatar>
						{user.name !== undefined && user.name !== "" && <h1 className="passport-header-profile-name">{user.name}</h1>}
						<div className="passport-profile-header-navigation">
							<div className={getTabClassName("basic")} onClick={event => {clickTab("basic")}}>
								<span className="passport-profile-header-tab-value">
									<i className="ri-user-4-line"></i>
									Basic Info
								</span>
							</div>
							<div className={getTabClassName("groups")} onClick={event => {clickTab("groups")}}>
								<span className="passport-profile-header-tab-value">
									<i className="ri-folders-line"></i>
									Groups
								</span>
							</div>
							<div className={getTabClassName("reset")} onClick={event => {clickTab("reset")}}>
								<span className="passport-profile-header-tab-value">
									<i className="ri-key-line"></i>
									Change Password
								</span>
							</div>
							<div className={getTabClassName("admin")} onClick={event => {clickTab("admin")}}>
								<span className="passport-profile-header-tab-value">
									<i className="ri-shield-flash-line"></i>
									Administration
								</span>
							</div>
							<div className={getTabClassName("delete")} onClick={event => {clickTab("delete")}}>
								<span className="passport-profile-header-tab-value">
									<i className="ri-delete-bin-7-line"></i>
									Delete Account
								</span>
							</div>
						</div>
					</div>
					<div className="passport-profile-main-page">
						{tabState === "basic" && <BasicInformation user={user} reloadUser={reloadUser}></BasicInformation>}
						{tabState === "reset" && <ResetPassword user={user}></ResetPassword>}
						{tabState === "delete" && <DeleteAccount user={user}></DeleteAccount>}
						{tabState === "groups" && <UserGroups user={user}></UserGroups>}
						{tabState === "admin" && <ProfileAdmin user={user}></ProfileAdmin>}
					</div>
				</div>
			}
		</div>
	)
}