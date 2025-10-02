import { useState } from "react";
import { useAuth } from "../../../Auth/AuthContext"
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = ()=>{

    const {token} = useAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion(){
        const url = `http://localhost:8080/api/messages/secure/add/message`;
        if(token && title !== '' && question !== ''){
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers:{
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            }

            const submitNewQuestionResponse = await fetch(url, requestOptions);

            if(!submitNewQuestionResponse.ok){
                throw new Error('something went wrong');
            }

            setTitle('');
            setQuestion('');
            setDisplaySuccess(true);
            setDisplayWarning(false);
        }
        else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="card mt-3">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Question added successfully 
                </div>
            }
            <div className="card-header">
                Ask question to Luv2Read Admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out!
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1"
                                placeholder="title" onChange={e=> setTitle(e.target.value)} value={title}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1"
                                rows={3} placeholder="question" onChange={e=> setQuestion(e.target.value)} value={question}/>
                    </div>

                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}