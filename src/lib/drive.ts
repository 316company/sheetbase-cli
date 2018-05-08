import * as google from './google';

interface IDriveFileCreationRequestBody {
    name: string,
    mimeType: string,
    parents?: string[]
}

interface IDriveFileCopyRequestBody {
    name: string,
    parents?: string[]
}

interface IScriptCreationRequestBody {
    title: string,
    parentId?: string
}


/**
 * Create Drive file
 * @param name - File name
 * @param mimeType - File type
 * @param parents - Parent folders
 */
export async function createFile(name: string, mimeType: string, parents: string[] = []): Promise<string> {
    return create(name, mimeType, parents);
}

/**
 * Create Drive folder
 * @param name - Folder name
 * @param parents - Parent folders
 */
export async function createFolder(name: string, parents: string[] = []): Promise<string> {
    return create(name, 'application/vnd.google-apps.folder', parents);
}

/**
 * Create script
 * @param title - Script name
 * @param parentId - Folder id
 */
export async function createScript(title: string, parentId: string = null): Promise<string>  {
    const client = await google.getClient();
    if(!client) return null;

    let data: IScriptCreationRequestBody = {
        title
    };
    if(parentId) data.parentId = parentId; 

    let response = await client.request<{scriptId: string}>({
        method: 'post',
        url: 'https://script.googleapis.com/v1/projects',
        data
    });
    
    if(!response.data.scriptId) return null;
    return response.data.scriptId;
}

/**
 * Create Drive file/folder
 * @param name - File/folder name
 * @param mimeType - File type
 * @param parents - Parent folders
 */
export async function create(name: string, mimeType: string, parents: string[] = []): Promise<string> {
    const client = await google.getClient();
    if(!client) return null;

    let data: IDriveFileCreationRequestBody = {
        name, mimeType
    };
    if(parents) data.parents = parents; 

    let response = await client.request<{id: string}>({
        method: 'post',
        url: 'https://www.googleapis.com/drive/v3/files',
        data
    });
    
    if(!response.data.id) return null;
    return response.data.id;
}

/**
 * Copy Drive file
 * @param fileId - Source file ID
 * @param name - File name
 * @param parents - Parent folders
 */
export async function copy(fileId: string, name: string, parents: string[] = []): Promise<string> {
    const client = await google.getClient();
    if(!client) return null;

    let data: IDriveFileCopyRequestBody = {
        name
    };
    if(parents) data.parents = parents;  

    let response = await client.request<{id: string}>({
        method: 'post',
        url: 'https://www.googleapis.com/drive/v3/files/'+ fileId +'/copy',
        data
    });
    
    if(!response.data.id) return null;
    return response.data.id;
}