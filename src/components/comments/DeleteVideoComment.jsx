import React, { useRef } from 'react';
import { deleteComment } from '../../services/commentService';
import { Button } from "@/components/ui/button"


function DeleteVideoComment({ commentId, setAllComments, setError,deleteCommentRef },ref) {
    const handleDeleteComment = async () => {
        setError("")
        try {
            const response = await deleteComment({ commentId })
            if (response.success === true) {
                if (deleteCommentRef.current) {
                    deleteCommentRef.current.remove();
                }
                setAllComments(prevComments => prevComments.filter(prev => prev._id !== commentId));
            }
        } catch (error) {
            console.error('Error deleting comments:', error);
            setError(error.response.data.message || "Error deleting comments")
        }
    }
    return (
        <div>
            <Button variant="ghost"
                onClick={()=>{handleDeleteComment()}}>Delete</Button>
        </div>
    );
}

export default React.forwardRef(DeleteVideoComment)