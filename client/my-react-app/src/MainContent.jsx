
import React, {useEffect, useState} from 'react'
import { format } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './cssmodules/MainContent.module.css'


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

function MainContent(){
    
    // Sample code to access all data of a specific note using the note id
    // const specificNote = notes.find(note => note.note_id === desiredId);
    // if (specificNote) {
    // console.log(specificNote.note_title);
    // console.log(specificNote.note_description); 

    const [title, setTitle] = useState('')
    const [description, setDesc] = useState('')
    const queryClient = useQueryClient();

    const {data: notes = []} = useQuery({
        queryKey: ['notes'],
        queryFn: getNotes
    });

    const mutation = useMutation({
        mutationFn: createNote, 
        onSettled: () => {
            queryClient.invalidateQueries(['notes'])
            setTitle('')
            setDesc('')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ title, description });
        
    };

    const content = <div className={styles.container}>
                        <div className={styles.mainContent}>
                            <form onSubmit={handleSubmit} className={styles.fields}>
                                <input 
                                    value={title} className='titleField' onChange={(e) => {setTitle(e.target.value)}} type="text" placeholder="Title"
                                />
                                <textarea 
                                    value={description} className='textArea' onChange={(e) => {setDesc(e.target.value)}} name="description" placeholder="Description">
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
                                                <tr key={note.note_id}>
                                                    <td>{note.note_title}</td>
                                                    <td>{formattedDate}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

    return(content);

}

export default MainContent