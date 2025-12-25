import React, {useEffect, useMemo, useRef, useState} from "react";

import './SchemaEditor.css'
import {Button, ButtonType} from "../../buttons/button/Button";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {Input} from "../../inputs/input/Input";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {DropdownItemText} from "../../inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {Description} from "../../text-decorations/description/Description";
import {GeneralHeading} from "../../text-decorations/general-heading/GeneralHeading";
import {IBlueOrangeSearchSchema, IBlueOrangeSearchSchemaProperty} from "../search-query-editor/SearchQueryEditor";
import {Modal} from "../../layouts/modal/modal/Modal";
import {ModalHeader} from "../../layouts/modal/modal-header/ModalHeader";
import {ModalBody} from "../../layouts/modal/modal-body/ModalBody";
import {ModalDescription} from "../../layouts/modal/modal-description/ModalDescription";
import {ModalFooter} from "../../layouts/modal/modal-footer/ModalFooter";
import {ModalFooterRight} from "../../layouts/modal/modal-footer-right/ModalFooterRight";
import {FileUploadBtn} from "../../buttons/file-upload-btn/FileUploadBtn";
import {TextArea} from "../../inputs/textarea/TextArea";

interface Props {
	schema?: IBlueOrangeSearchSchema,
	showHeader?: boolean,
	headerTitle?: string,
	headerDescription?: string,
	onChange?: (schema: IBlueOrangeSearchSchema) => void
}

type SchemaNode = {
	id: string,
	apiName: string,
	displayName?: string,
	type: string,
	analyzer?: string,
	dims?: number,
	similarity?: string,
	children?: SchemaNode[]
}

const newNodeId = () => {
	return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const DEFAULT_TYPES = [
	"TEXT",
	"KEYWORDS",
	"SEARCH_AS_YOU_TYPE",
	"INTEGER",
	"LONG",
	"FLOAT",
	"DOUBLE",
	"DATE",
	"BOOLEAN",
	"GEO_POINT",
	"VECTOR",
	"OBJECT",
	"STRING"
];

const schemaSignature = (s?: IBlueOrangeSearchSchema): string => {
	const normalized = (s?.properties ?? [])
		.map((p) => ({
			apiName: String(p.apiName ?? ""),
			displayName: p.displayName ?? "",
			type: String(p.type ?? ""),
			analyzer: p.analyzer ?? "",
			dims: p.dims ?? "",
			similarity: p.similarity ?? ""
		}))
		.sort((a, b) => a.apiName.localeCompare(b.apiName));

	return JSON.stringify(normalized);
}

export const SchemaEditor: React.FC<Props> = ({
	schema,
	showHeader=true,
	headerTitle="Schema",
	headerDescription="Build a schema by adding fields",
	onChange
}) => {

	const initSchema = (): IBlueOrangeSearchSchema => {
		return schema ?? {properties: []};
	}

	const [internalSchema, setInternalSchema] = useState<IBlueOrangeSearchSchema>(initSchema());
	const [nodes, setNodes] = useState<SchemaNode[]>([]);
	const lastEmittedSchemaSignatureRef = useRef<string | null>(null);

	const [importModalOpen, setImportModalOpen] = useState(false);
	const [importJsonText, setImportJsonText] = useState<string>("");
	const [importError, setImportError] = useState<string | undefined>(undefined);

	useEffect(() => {
		const nextSchema = initSchema();
		const nextSignature = schemaSignature(nextSchema);
		if (lastEmittedSchemaSignatureRef.current && nextSignature === lastEmittedSchemaSignatureRef.current) {
			return;
		}
		setInternalSchema(nextSchema);
		setNodes(schemaToNodes(nextSchema));
	}, [schema]);

	const dispatchChange = (updated: IBlueOrangeSearchSchema) => {
		lastEmittedSchemaSignatureRef.current = schemaSignature(updated);
		if (onChange) {
			onChange(updated);
		}
	}

	const schemaType = (type: string): string => {
		return String(type ?? "").toUpperCase();
	}

	const formatDisplayName = (name: string): string => {
		if (!name) {
			return "";
		}
		const noUnderscore = name.replace(/_/g, " ");
		const withSpaces = noUnderscore
			.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
			.replace(/\s+/g, " ")
			.trim();
		return withSpaces
			.split(" ")
			.filter(Boolean)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	const shouldShowAnalyzer = (type: string) => {
		const t = schemaType(type);
		return t === "TEXT" || t === "KEYWORDS" || t === "SEARCH_AS_YOU_TYPE";
	}

	const shouldShowVectorOptions = (type: string) => {
		return schemaType(type) === "VECTOR";
	}

	const schemaToNodes = (s: IBlueOrangeSearchSchema): SchemaNode[] => {
		const result: SchemaNode[] = [];
		(s.properties ?? []).forEach((p) => {
			const path = String(p.apiName ?? "").split(".").filter(Boolean);
			let currentLevel = result;
			let currentNode: SchemaNode | undefined;
			path.forEach((segment, idx) => {
				const isLeaf = idx === path.length - 1;
				let existing = currentLevel.find((n) => n.apiName === segment);
				if (!existing) {
					existing = {
						id: newNodeId(),
						apiName: segment,
						displayName: formatDisplayName(segment),
						type: isLeaf ? String(p.type ?? "STRING") : "OBJECT",
						analyzer: undefined,
						dims: undefined,
						similarity: undefined,
						children: isLeaf ? undefined : []
					};
					currentLevel.push(existing);
				}
				currentNode = existing;
				if (!isLeaf) {
					currentNode.children = currentNode.children ?? [];
					currentLevel = currentNode.children;
				}
			});
			if (currentNode) {
				currentNode.type = String(p.type ?? currentNode.type);
				currentNode.displayName = p.displayName ?? currentNode.displayName;
				currentNode.analyzer = p.analyzer;
				currentNode.dims = p.dims;
				currentNode.similarity = p.similarity;
				if (schemaType(currentNode.type) === "OBJECT") {
					currentNode.children = currentNode.children ?? [];
				}
			}
		});
		return result;
	}

	const nodesToSchema = (tree: SchemaNode[]): IBlueOrangeSearchSchema => {
		const props: IBlueOrangeSearchSchemaProperty[] = [];
		const visit = (node: SchemaNode, prefix: string) => {
			const fullName = prefix ? `${prefix}.${node.apiName}` : node.apiName;
			const t = schemaType(node.type);
			props.push({
				apiName: fullName,
				displayName: node.displayName,
				type: node.type,
				analyzer: node.analyzer,
				dims: node.dims,
				similarity: node.similarity
			});
			if (t === "OBJECT" && node.children) {
				node.children.forEach((c) => visit(c, fullName));
			}
		};
		tree.forEach((n) => visit(n, ""));
		return {properties: props};
	}

	const applyNodes = (nextNodes: SchemaNode[]) => {
		setNodes(nextNodes);
		const updatedSchema = nodesToSchema(nextNodes);
		setInternalSchema(updatedSchema);
		dispatchChange(updatedSchema);
	}

	const uniqueChildName = (siblings: SchemaNode[], base: string) => {
		const existing = new Set((siblings ?? []).map(s => String(s.apiName ?? "")));
		if (!existing.has(base)) {
			return base;
		}
		let i = 2;
		while (existing.has(`${base}_${i}`)) {
			i++;
		}
		return `${base}_${i}`;
	}

	const inferTypeFromValue = (value: any): {type: string, analyzer?: string, dims?: number, similarity?: string} => {
		if (value === null || value === undefined) {
			return {type: "STRING"};
		}
		if (Array.isArray(value)) {
			if (value.length > 0 && value.every((v) => typeof v === 'number' && !isNaN(v))) {
				return {type: "VECTOR", dims: value.length, similarity: "cosine"};
			}
			if (value.length > 0 && value.every((v) => typeof v === 'string')) {
				return {type: "KEYWORDS"};
			}
			const firstObj = value.find((v) => v && typeof v === 'object');
			if (firstObj && typeof firstObj === 'object') {
				return {type: "OBJECT"};
			}
			return {type: "OBJECT"};
		}
		if (typeof value === 'boolean') {
			return {type: "BOOLEAN"};
		}
		if (typeof value === 'number') {
			return {type: Number.isInteger(value) ? "INTEGER" : "DOUBLE"};
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			const isoDate = /^\d{4}-\d{2}-\d{2}([T\s].*)?$/.test(trimmed);
			if (isoDate && !isNaN(Date.parse(trimmed))) {
				return {type: "DATE"};
			}
			return {type: "TEXT", analyzer: "standard"};
		}
		if (typeof value === 'object') {
			return {type: "OBJECT"};
		}
		return {type: "STRING"};
	}

	const buildSchemaFromJson = (example: any): IBlueOrangeSearchSchema => {
		const properties: IBlueOrangeSearchSchemaProperty[] = [];

		const visit = (obj: any, prefix: string) => {
			if (!obj || typeof obj !== 'object') {
				return;
			}
			for (const key of Object.keys(obj)) {
				const value = obj[key];
				const fullName = prefix ? `${prefix}.${key}` : key;
				const inferred = inferTypeFromValue(value);
				properties.push({
					apiName: fullName,
					displayName: formatDisplayName(key),
					type: inferred.type,
					analyzer: inferred.analyzer,
					dims: inferred.dims,
					similarity: inferred.similarity
				});
				if (schemaType(inferred.type) === "OBJECT") {
					if (Array.isArray(value)) {
						const firstObj = value.find((v: any) => v && typeof v === 'object');
						visit(firstObj ?? {}, fullName);
					} else {
						visit(value, fullName);
					}
				}
			}
		};

		if (Array.isArray(example)) {
			const first = example.find((v) => v && typeof v === 'object');
			visit(first ?? {}, "");
		} else {
			visit(example, "");
		}

		return {properties};
	}

	const importFromJson = () => {
		setImportError(undefined);
		try {
			const parsed = JSON.parse(importJsonText);
			const nextSchema = buildSchemaFromJson(parsed);
			setInternalSchema(nextSchema);
			setNodes(schemaToNodes(nextSchema));
			dispatchChange(nextSchema);
			setImportModalOpen(false);
		} catch (e: any) {
			setImportError("Invalid JSON");
		}
	}

	const handleImportFile = (file: File) => {
		setImportError(undefined);
		const reader = new FileReader();
		reader.onload = () => {
			setImportJsonText(typeof reader.result === 'string' ? reader.result : "");
		};
		reader.onerror = () => {
			setImportError("Failed to read file");
		};
		reader.readAsText(file);
	}

	const addProperty = () => {
		const apiName = uniqueChildName(nodes, `field_${(nodes?.length ?? 0) + 1}`);
		const next: SchemaNode = {
			id: newNodeId(),
			apiName: apiName,
			displayName: formatDisplayName(apiName),
			type: "TEXT",
			analyzer: "",
			dims: undefined,
			similarity: "",
			children: undefined
		};
		applyNodes([...(nodes ?? []), next]);
	}

	const addChildTo = (parentId: string, asObject: boolean) => {
		const addRec = (list: SchemaNode[]): SchemaNode[] => {
			return list.map((n) => {
				if (n.id === parentId) {
					const children = n.children ?? [];
					const base = asObject ? `object_${children.length + 1}` : `field_${children.length + 1}`;
					const childApiName = uniqueChildName(children, base);
					const child: SchemaNode = asObject ? {
						id: newNodeId(),
						apiName: childApiName,
						displayName: formatDisplayName(childApiName),
						type: "OBJECT",
						children: []
					} : {
						id: newNodeId(),
						apiName: childApiName,
						displayName: formatDisplayName(childApiName),
						type: "TEXT",
						analyzer: "",
						similarity: "",
						dims: undefined,
						children: undefined
					};
					return {...n, children: [...children, child]};
				}
				if (n.children) {
					return {...n, children: addRec(n.children)};
				}
				return n;
			});
		}
		applyNodes(addRec(nodes ?? []));
	}

	const updateNode = (nodeId: string, patch: Partial<SchemaNode>) => {
		const updateRec = (list: SchemaNode[]): SchemaNode[] => {
			return list.map((n) => {
				if (n.id === nodeId) {
					const next: SchemaNode = {...n, ...patch};
					const t = schemaType(next.type);
					if (!shouldShowAnalyzer(t)) {
						next.analyzer = undefined;
					}
					if (!shouldShowVectorOptions(t)) {
						next.dims = undefined;
						next.similarity = undefined;
					}
					if (t === "OBJECT") {
						next.children = next.children ?? [];
					} else {
						next.children = undefined;
					}
					return next;
				}
				if (n.children) {
					return {...n, children: updateRec(n.children)};
				}
				return n;
			});
		}
		applyNodes(updateRec(nodes ?? []));
	}

	const deleteNode = (nodeId: string) => {
		const deleteRec = (list: SchemaNode[]): SchemaNode[] => {
			return list
				.filter((n) => n.id !== nodeId)
				.map((n) => n.children ? {...n, children: deleteRec(n.children)} : n);
		}
		applyNodes(deleteRec(nodes ?? []));
	}

	const resetSchema = () => {
		const updated: IBlueOrangeSearchSchema = {properties: []};
		setInternalSchema(updated);
		setNodes([]);
		dispatchChange(updated);
	}

	const typeOptions = useMemo(() => {
		const seen = new Set<string>();
		const types = [...DEFAULT_TYPES];
		for (const t of types) {
			seen.add(t);
		}
		return Array.from(seen);
	}, []);

	const dropdownStyle: React.CSSProperties = {
		backgroundColor: "#e0e1e2",
		fontSize: "0.8rem",
		minWidth: "180px"
	}

	const rowStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-end",
		gap: "10px",
		flexWrap: "wrap",
		width: "100%"
	}

	const renderNode = (node: SchemaNode, depth: number, parentPath: string) => {
		const fullPath = parentPath ? `${parentPath}.${node.apiName}` : node.apiName;
		const indentStyle: React.CSSProperties = {marginLeft: `${depth * 22}px`};
		const t = schemaType(node.type);

		return (
			<div key={node.id}>
				<div className="blue-orange-schema-editor-row" style={{...rowStyle, ...indentStyle}}>
					<Input
						label={"API Name"}
						value={String(node.apiName ?? "")}
						onChange={(v) => updateNode(node.id, {apiName: v})}
					></Input>
					<Input
						label={"Display Name"}
						value={node.displayName === undefined || node.displayName === null ? "" : String(node.displayName)}
						onChange={(v) => updateNode(node.id, {displayName: v})}
					></Input>
					<div className="blue-orange-schema-editor-type">
						<Dropdown label={"Type"} style={dropdownStyle} onSelection={(item) => updateNode(node.id, {type: item.reference})}>
							{typeOptions.map((opt) => (
								<DropdownItemText key={opt} label={opt} value={opt} selected={schemaType(node.type) === opt}></DropdownItemText>
							))}
						</Dropdown>
					</div>
					{shouldShowAnalyzer(node.type) &&
						<Input
							label={"Analyzer"}
							value={node.analyzer === undefined || node.analyzer === null ? "" : String(node.analyzer)}
							onChange={(v) => updateNode(node.id, {analyzer: v})}
						></Input>
					}
					{shouldShowVectorOptions(node.type) &&
						<>
							<Input
								label={"Dims"}
								isNumber={true}
								value={node.dims === undefined || node.dims === null ? "" : String(node.dims)}
								onChange={(v) => {
									const n = parseInt(v, 10);
									updateNode(node.id, {dims: isNaN(n) ? undefined : n});
								}}
							></Input>
							<Input
								label={"Similarity"}
								value={node.similarity === undefined || node.similarity === null ? "" : String(node.similarity)}
								onChange={(v) => updateNode(node.id, {similarity: v})}
							></Input>
						</>
					}
					<div className="blue-orange-schema-editor-row-actions">
						<ButtonIcon icon={"ri-close-line"} label={"Delete"} onClick={() => deleteNode(node.id)}></ButtonIcon>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="blue-orange-schema-editor-container">
			{showHeader &&
				<div className="blue-orange-schema-editor-header">
					<div className="blue-orange-schema-editor-header-left-cont">
						<GeneralHeading>{headerTitle}</GeneralHeading>
						{headerDescription && <Description>{headerDescription}</Description>}
					</div>
					<div className="blue-orange-schema-editor-header-controls">
						<ButtonIcon icon={"ri-upload-2-line"} label={"Import JSON"} onClick={() => {setImportModalOpen(true); setImportError(undefined);}}></ButtonIcon>
						<ButtonIcon icon={"ri-refresh-fill"} label={"Reset"} onClick={() => resetSchema()}></ButtonIcon>
						<Button text={"Add Field"} buttonType={ButtonType.PRIMARY} onClick={() => addProperty()}></Button>
					</div>
				</div>
			}
			<div className="blue-orange-schema-editor-body">
				{(nodes ?? []).map((n) => renderNode(n, 0, ""))}
				{(nodes ?? []).length === 0 &&
					<div className="blue-orange-schema-editor-empty">
						<Button text={"Add your first field"} buttonType={ButtonType.PRIMARY} onClick={() => addProperty()}></Button>
					</div>
				}
			</div>
			{importModalOpen &&
				<Modal width={800} minWidth={800} minHeight={520} onClose={() => setImportModalOpen(false)}>
					<ModalHeader label={"Import JSON"} onClose={() => setImportModalOpen(false)}></ModalHeader>
					<ModalDescription description={"Upload or paste a JSON object to generate a schema"}></ModalDescription>
					<ModalBody>
						<div className={"blue-orange-schema-editor-import-actions"}>
							<FileUploadBtn accept={"*/*"} label={"Upload JSON"} icon={true} onFileSelect={handleImportFile}></FileUploadBtn>
						</div>
						<div className={"blue-orange-schema-editor-import-text"}>
							<TextArea label={"JSON"} value={importJsonText} onChange={setImportJsonText}></TextArea>
						</div>
						{importError &&
							<div className={"blue-orange-schema-editor-import-error"}>{importError}</div>
						}
					</ModalBody>
					<ModalFooter>
						<ModalFooterRight>
							<Button text={"Generate"} buttonType={ButtonType.PRIMARY} onClick={() => importFromJson()}></Button>
						</ModalFooterRight>
					</ModalFooter>
				</Modal>
			}
		</div>
	)
}
