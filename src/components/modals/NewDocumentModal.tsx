import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory } from '../../types';
import { FolderOpen, X } from 'lucide-react';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMatterId?: string;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMatterId 
}) => {
  const { matters, addDocument, currentUser, setActiveTab } = useApp();

  const [matterId, setMatterId] = useState(defaultMatterId || matters[0]?.id || '');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Pleadings');
  const [tags, setTags] = useState('Originating Process, High Court');
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [contentSnippet, setContentSnippet] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = matters.find(m => m.id === matterId);
    if (!matter || !title) return;

    addDocument({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      title,
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      category,
      uploadedBy: currentUser.name,
      fileSize: '1.4 MB',
      fileType: 'PDF',
      tags: tags.split(',').map(t => t.trim()),
      isClientVisible,
      contentSnippet: contentSnippet || `IN THE ${matter.court.toUpperCase()}\n${matter.caseNumber}\n${title.toUpperCase()}\n\nFiled and served by LexisFirm Advocates.`
    });

    setActiveTab('documents');
    onClose();
  };

  const categories: DocumentCategory[] = [
    'Pleadings', 'Court Orders', 'Evidence', 'Conveyancing Deeds', 'Correspondence', 'Billing', 'Legal Opinions'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-400" />
            Upload Legal Document to Case Archive
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Matter Reference</label>
            <select
              value={matterId}
              onChange={(e) => setMatterId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              {matters.map(m => (
                <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 35)}...</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Affidavit of Service or Chamber Summons"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">File Name</label>
              <input
                type="text"
                placeholder="Affidavit_Service.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Document Transcript / Legal Text (for AI Analysis)</label>
            <textarea
              placeholder="Paste pleading text, extracted clauses or court orders here..."
              value={contentSnippet}
              onChange={(e) => setContentSnippet(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isClientVis"
              checked={isClientVisible}
              onChange={(e) => setIsClientVisible(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <label htmlFor="isClientVis" className="text-slate-300 font-semibold">
              Publish to Client Portal (ABC Limited)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
