// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {models} from '../models';
import {main} from '../models';

export function AddProject(arg1:models.Project):Promise<main.ProjectAndError>;

export function DeleteProjectById(arg1:string):Promise<void>;

export function EditProjectTitle(arg1:string,arg2:string):Promise<void>;

export function GetAllProjects():Promise<main.ProjectsAndError>;
