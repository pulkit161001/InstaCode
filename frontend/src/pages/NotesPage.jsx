import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react'; // Importing icons from lucide-react
import { useTheme } from '../hooks/useTheme';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingNote, setEditingNote] = useState({ title: '', description: '' });
  const [showDescription, setShowDescription] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const savedNotes = localStorage.getItem('instacode_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from localStorage:', e);
      }
    }
  }, []);

  const handleAddNoteClick = () => {
    setEditingId(null);
    setEditingNote({ title: '', description: '' });
    setShowModal(true);
  };

  const handleSaveModal = () => {
    if (!editingNote.title.trim() || !editingNote.description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    const updatedNotes = editingId
      ? notes.map((n) => (n.id === editingId ? { ...n, ...editingNote } : n))
      : [...notes, { id: Date.now(), ...editingNote }];

    setNotes(updatedNotes);
    localStorage.setItem('instacode_notes', JSON.stringify(updatedNotes));
    setShowModal(false);
    setEditingNote({ title: '', description: '' });
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setEditingNote({ title: '', description: '' });
    setEditingId(null);
  };

  const handleEditStart = (note) => {
    setEditingId(note.id);
    setEditingNote({ title: note.title, description: note.description });
  };

  const handleSaveEdit = (noteId) => {
    if (!editingNote.title.trim() || !editingNote.description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    const updatedNotes = notes.map((n) =>
      n.id === noteId ? { ...n, ...editingNote } : n
    );

    setNotes(updatedNotes);
    localStorage.setItem('instacode_notes', JSON.stringify(updatedNotes));
    setEditingId(null);
    setEditingNote({ title: '', description: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingNote({ title: '', description: '' });
  };

  const handleDeleteStart = (noteId) => {
    setDeleteConfirm(noteId);
  };

  const handleDeleteConfirm = () => {
    const updatedNotes = notes.filter((n) => n.id !== deleteConfirm);
    setNotes(updatedNotes);
    localStorage.setItem('instacode_notes', JSON.stringify(updatedNotes));
    setDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className={`text-3xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>My Notes</h1>
        <div className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>Here you can review all your notes.</p>
          <p>You can have all your notes printed as PDF.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            No notes yet. Create your first note!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`group relative p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center gap-4">
                <span className={`text-lg font-semibold flex-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {editingId === note.id ? (
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                      className={`w-full px-2 py-1 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                    />
                  ) : (
                    note.title
                  )}
                </span>

                <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200">
                  {editingId === note.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit()}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Edit
                        className={`w-5 h-5 cursor-pointer ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => handleEditStart(note)}
                      />
                      <Trash2
                        className={`w-5 h-5 cursor-pointer ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => handleDeleteStart(note.id)}
                      />
                      <button
                        onClick={() => setShowDescription(note.id === showDescription ? null : note.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 whitespace-nowrap"
                      >
                        {showDescription === note.id ? 'Hide' : 'Show'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showDescription === note.id && !editingId && (
                <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {note.description}
                </p>
              )}

              {editingId === note.id && (
                <textarea
                  value={editingNote.description}
                  onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
                  className={`w-full mt-2 px-2 py-1 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                  rows="3"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-sm w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Delete Note?
            </h2>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Are you sure you want to delete "{notes.find((n) => n.id === deleteConfirm)?.title}"?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleDeleteCancel()}
                className={`px-4 py-2 rounded transition-colors ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {editingId ? 'Edit Note' : 'Add Note'}
            </h2>

            <input
              type="text"
              placeholder="Note title"
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              className={`w-full px-3 py-2 mb-4 rounded border ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
            />

            <textarea
              placeholder="Note description"
              value={editingNote.description}
              onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
              className={`w-full px-3 py-2 mb-4 rounded border ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
              rows="5"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleCancelModal()}
                className={`px-4 py-2 rounded transition-colors ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveModal()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Button */}
      <button
        onClick={() => handleAddNoteClick()}
        className={`mt-6 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
      >
        Add Note
      </button>
    </div>
  );
};

export default NotesPage;
