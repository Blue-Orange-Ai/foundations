import React, {useState, useContext} from "react";
import {IUser} from "../../../../interfaces/AppInterfaces";

import './AddMemberToGroupForm.css'
import {GroupPermission, SimpleGroupMember} from "@blue-orange-ai/foundations-clients";
import {v4 as uuidv4} from "uuid";
import {
    Button,
    ButtonType,
    Dropdown, DropdownItemIcon,
    GeneralHeading,
    InputForm, TagInputGroups, TagInputUsers,
    ToastContext,
    ToasterType,
    ToastLocation
} from "@blue-orange-ai/foundations-core";
import {isDisabled} from "@testing-library/user-event/dist/utils";
import passport from "@blue-orange-ai/foundations-core/dist/types/components/config/BlueOrangePassportConfig";

interface Props {
    groupId: string,
    showHeader?: boolean,
    showPermission?: boolean,
    showCancelBtn?: boolean,
    headerTitle?: string,
    memberType?: "USER" | "GROUP",
    defaultPermission?: "READ" | "EDIT" | "OWNER",
    forceMemberType?: boolean,
    showToasters?: boolean,
    onSuccess?: (memberType: "USER" | "GROUP", members: string[]) => void,
    onError?: (memberType: "USER" | "GROUP", members: string[]) => void
    onCancel?: () => void
}
export const AddMemberToGroupForm: React.FC<Props> = ({
    groupId,
    showToasters = true,
   showPermission = true,
    memberType = "USER",
    forceMemberType = false,
    showHeader=true,
    showCancelBtn=true,
    headerTitle="Add Member to Group",
    defaultPermission,
    onSuccess,
    onError,
    onCancel
  }) => {

    const { addToast } = useContext(ToastContext);

    const [selectedMembersUsers, setSelectedMembersUsers] = useState<Array<string>>([]);

    const [selectedMembersGroups, setSelectedMembersGroups] = useState<Array<string>>([]);

    const [addMemberPermission, setAddMemberPermission] = useState<"READ" | "EDIT" | "OWNER">(defaultPermission || "READ");

    const [addMemberType, setAddMemberType] = useState<"USER" | "GROUP">(memberType);

    const [addGroupLoading, setAddGroupLoading] = useState<boolean>(false);

    const addMembersToGroup = () => {
        const selectedMembers = addMemberType == "USER" ? selectedMembersUsers : selectedMembersGroups;
        if (selectedMembers.length > 0) {
            var addMembers: Array<SimpleGroupMember> = [];
            var permission: GroupPermission = GroupPermission.READ;
            if (addMemberPermission == "OWNER") {
                permission = GroupPermission.OWNER;
            } else if (addMemberPermission == "EDIT") {
                permission = GroupPermission.EDITOR;
            }
            for (var i=0; i < selectedMembers.length; i++) {
                addMembers.push({
                    memberId: selectedMembers[i],
                    permission: permission
                })
            }
            setAddGroupLoading(true);
            passport.adminAddMembersToGroup({
                members: addMembers,
                id: groupId
            }).then((result: any) => {
                setAddGroupLoading(false);
                if (showToasters) {
                    addToast({
                        id: uuidv4(),
                        heading: "Groups added",
                        description: "",
                        location: ToastLocation.TOP_RIGHT,
                        toastType: ToasterType.SUCCESS,
                        ttl: 5000
                    })
                }
                if (onSuccess) {
                    onSuccess(memberType, selectedMembers);
                }
            }).catch((error: any) => {
                setAddGroupLoading(false);
                if (showToasters) {
                    addToast({
                        id: uuidv4(),
                        heading: "An error occurred while adding groups",
                        description: "",
                        location: ToastLocation.TOP_RIGHT,
                        toastType: ToasterType.ERROR,
                        ttl: 5000})
                }
                if (onError) {
                    onError(memberType, selectedMembers);
                }

            })
        }
    }

	return (
		<>
            <InputForm>
                {showHeader &&
                    <GeneralHeading>{headerTitle}</GeneralHeading>
                }
                {!forceMemberType &&
                    <Dropdown label={"Member Type"} onSelection={(item) => setAddMemberType(item.reference as ("GROUP" | "USER"))}>
                        <DropdownItemIcon src={"ri-shield-star-fill"} label={"Group"} value={"GROUP"} selected={addMemberType == "GROUP"}></DropdownItemIcon>
                        <DropdownItemIcon src={"ri-pencil-fill"} label={"User"} value={"USER"} selected={addMemberType == "USER"}></DropdownItemIcon>
                    </Dropdown>
                }
                {showPermission &&
                    <Dropdown label={"Permission"} onSelection={(item) => setAddMemberPermission(item.reference as ("READ" | "EDIT" | "OWNER"))}>
                        <DropdownItemIcon src={"ri-shield-star-fill"} label={"Owner"} value={"OWNER"} selected={addMemberPermission == "OWNER"}></DropdownItemIcon>
                        <DropdownItemIcon src={"ri-pencil-fill"} label={"Edit"} value={"EDIT"} selected={addMemberPermission == "EDIT"}></DropdownItemIcon>
                        <DropdownItemIcon src={"ri-eye-fill"} label={"Read"} value={"READ"} selected={addMemberPermission == "READ"}></DropdownItemIcon>
                    </Dropdown>
                }
                {addMemberType == "USER" &&
                    <TagInputUsers onChange={setSelectedMembersUsers}></TagInputUsers>
                }
                {addMemberType == "GROUP" &&
                    <TagInputGroups onChange={setSelectedMembersGroups}></TagInputGroups>
                }
            </InputForm>
            <div className="passport-add-member-to-group-footer">
                <Button
                    text={"Save"}
                    buttonType={ButtonType.PRIMARY}
                    onClick={addMembersToGroup}
                    isLoading={addGroupLoading}></Button>
                {showCancelBtn &&
                    <Button
                        text={"Cancel"}
                        buttonType={ButtonType.SECONDARY}
                        onClick={() => {
                            if (onCancel) {
                                onCancel();
                            }
                        }
                        }
                        isDisabled={addGroupLoading}></Button>
                }
            </div>
        </>

	)
}