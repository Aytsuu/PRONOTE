
import React, {useEffect, useState} from 'react'
import { format, set } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './cssmodules/MainContent.module.css'
import { IoIosArrowRoundBack } from "react-icons/io";
import { HiPencil } from "react-icons/hi2";
import { IoMdTrash } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

// Using fetch API to connect to the web server and perform CRUD
const getNotes = async () => {
    const response = await fetch('http://localhost:4000/note')
    if (!response.ok) {
        throw new Error('Failed to fetch notes');
    }
    const data = await response.json();
    return data;
}

const createNote = async ({ title, description }) => {
    await fetch('http://localhost:4000/note', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });
};

const updateNote = async ({id, title, description }) => {
    await fetch(`http://localhost:4000/note/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({title, description }),
    });
};

const deleteNote = async ({id}) => {
    await fetch(`http://localhost:4000/note/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        }
    });
};

function MainContent(){

    const [noteId, setNoteId] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDesc] = useState('')
    const [isView, setIsView] = useState(false)
    const [isEdit, setIsEdit] = useState()
    const queryClient = useQueryClient();


    const {data: notes = []} = useQuery({
        queryKey: ['notes'],
        queryFn: getNotes
    });

    const createMutation = useMutation({
        mutationFn: createNote, 
        onSettled: () => {
            queryClient.invalidateQueries(['notes'])
            setTitle('')
            setDesc('')
        }
    })

    const editMutation = useMutation({
        mutationFn: updateNote,
        onSettled: () => {
            queryClient.invalidateQueries(['notes']);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSettled: () => {
            queryClient.invalidateQueries(['notes']);
            handleExitView()
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate({ title, description });
        
    };

    const handleRowClick = (noteId) => {
        setIsView(!isView)
        setNoteId(noteId)
        const specificNote = (notes.find(note => note.note_id === noteId))
        if(specificNote){
            setNoteId(specificNote.note_id)
            setTitle(specificNote.note_title)
            setDesc(specificNote.note_description)
        } 
    }

    const handleExitView = () => {
        setNoteId('')
        setTitle('')
        setDesc('')
        setIsView(!isView)
    }

    const handleEdit = () => {
        if(isEdit && noteId){
            editMutation.mutate({id: noteId, title, description})
        } 
        setIsEdit(!isEdit)
    }
    
    const handleDelete = () => {
        deleteMutation.mutate({id: noteId})
    }

    const content = <div className={styles.container}>
                        <div className={styles.mainContent}>

                            {isView ? 

                                <>
                                {/* If a note is clicked */}
                                    <form onSubmit={handleSubmit} className={styles.Viewfields}> 
                                        <div className='flex flex-row items-center justify-between w-full p-0 m-0'>
                                            <div className='flex flex-row items-center cursor-pointer group' onClick={handleExitView}>
                                                <IoIosArrowRoundBack className='h-auto w-[1.8rem] text-[#ffffff70] group-hover:text-[#FF003D]'/>
                                                <h1 className='text-[15px] h-auto text-[#ffffff70] group-hover:text-[#FF003D]'>Back</h1>
                                            </div>

                                            <div className='flex flex-row items-center space-x-2 cursor-pointer'>
                                                <IoMdTrash className='h-auto w-[1.4rem] text-[#ffffff70] hover:text-[#FF003D]' onClick={handleDelete}/>   

                                                {isEdit ? 
                                                    <FaCheck className='h-auto w-[1.4rem] text-[#ffffff70] hover:text-[#FF003D]' onClick={handleEdit}/>
                                                    :
                                                    <HiPencil className='h-auto w-[1.4rem] text-[#ffffff70] hover:text-[#FF003D]' onClick={handleEdit}/>
                                                }
                                            </div>
                                        </div>
                                        <input 
                                            value={title} className='titleField ' onChange={(e) => {setTitle(e.target.value)}} type="text" placeholder="Title" 
                                            readOnly={isEdit ? false: true}
                                        />
                                        <textarea 
                                            value={description} className='textArea' onChange={(e) => {setDesc(e.target.value)}} name="description" placeholder="Description"
                                            readOnly={isEdit ? false: true}
                                        />    
                                    </form>
                                </>

                                : 

                                <>
                                {/* If a note is not clicked */}
                                    <form onSubmit={handleSubmit} className={styles.fields}> 
                                        <input 
                                            value={title} className='titleField' onChange={(e) => {setTitle(e.target.value)}} type="text" placeholder="Title"
                                        />
                                        <textarea 
                                            value={description} 
                                            className='textArea' 
                                            onChange={(e) => {setDesc(e.target.value)}} 
                                            name="description" 
                                            placeholder="Description">
                                        </textarea>
                                        <div className={styles.footer}>
                                            <button type='submit'>Save</button>
                                        </div>
                                    </form>
                                    <div className={styles.display}>
                                        <h1>My Notes</h1>
                                        <table>
                                            <tbody>
                                                {notes.map((note) => {
                                                    const dateValue = new Date(note.note_date); // Attempt to parse the date
                                                    const formattedDate = isNaN(dateValue) ? 'Invalid date' : format(dateValue, 'yyyy-MM-dd');
                                                    return(
                                                        <tr key={note.note_id} onClick={() => handleRowClick(note.note_id)}>
                                                            <td>{note.note_title}</td>
                                                            <td>{formattedDate}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            }
                        </div>
                    </div>

    return(
        <>
            {content}
        </>
    );

}

export default MainContent