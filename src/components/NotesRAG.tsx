import React, { useState } from 'react';
import { NoteDocument } from '../types';
import { 
  FileText, 
  Upload, 
  Search, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  FileUp, 
  Layers, 
  Tag,
  ExternalLink
} from 'lucide-react';

interface NotesRAGProps {
  notes: NoteDocument[];
  onUploadNote: (newNote: NoteDocument) => void;
  onTeachWithNote: (topic: string, noteTitle: string, noteContent: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const NotesRAG: React.FC<NotesRAGProps> = ({
  notes,
  onUploadNote,
  onTeachWithNote,
  onNavigateTab,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('3NF vs BCNF decomposition');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadSubject, setUploadSubject] = useState<'dbms' | 'os' | 'cn' | 'daa' | 'se'>('dbms');
  const [uploadTextContent, setUploadTextContent] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const currentDoc = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleSearchRAG = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      // Semantic simulated vector match across all chunks
      const qLower = searchQuery.toLowerCase();
      const matches: any[] = [];

      notes.forEach((doc) => {
        doc.chunks.forEach((chunk) => {
          const contentLower = chunk.content.toLowerCase();
          const headingLower = chunk.heading.toLowerCase();

          let score = 0.70;
          if (contentLower.includes(qLower) || headingLower.includes(qLower)) {
            score = 0.96;
          } else if (qLower.split(' ').some((word) => word.length > 3 && contentLower.includes(word))) {
            score = 0.88;
          }

          if (score > 0.75) {
            matches.push({
              docId: doc.id,
              docTitle: doc.title,
              fileName: doc.fileName,
              chunkId: chunk.id,
              heading: chunk.heading,
              page: chunk.page,
              content: chunk.content,
              relevanceScore: Math.round(score * 100),
            });
          }
        });
      });

      matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
      setSearchResults(matches);
      setIsSearching(false);
    }, 450);
  };

  const handleCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const newDoc: NoteDocument = {
      id: `note-${Date.now()}`,
      title: uploadFileName,
      subjectId: uploadSubject,
      fileName: uploadFileName.endsWith('.pdf') ? uploadFileName : `${uploadFileName}.pdf`,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: '2.8 MB',
      pageCount: 14,
      summary: 'Student uploaded lecture handout with personalized annotations and solved exam questions.',
      tags: ['Student Notes', uploadSubject.toUpperCase(), 'Uploaded'],
      chunks: [
        {
          id: `chunk-${Date.now()}-1`,
          heading: 'Uploaded Document Key Excerpt',
          page: 1,
          content: uploadTextContent || 'Sample extracted lecture notes text: Functional dependencies X -> Y, candidate keys, and relational schema decomposition methods for semester exams.',
        },
      ],
    };

    onUploadNote(newDoc);
    setSelectedNoteId(newDoc.id);
    setShowUploadModal(false);
    setUploadFileName('');
    setUploadTextContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Notes & RAG Grounding
              </span>
              <span className="text-xs text-slate-500">Document Retrieval Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
              Personalized Notes & Grounded AI Teaching
            </h1>
            <p className="text-xs text-slate-500">
              Upload your professor's lecture notes and slides. The AI Tutor retrieves exact passages and teaches directly according to your syllabus materials!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Lecture PDF / Notes</span>
            </button>
          </div>
        </div>

        {/* Semantic RAG Search Box */}
        <form onSubmit={handleSearchRAG} className="pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search concepts across your notes using RAG (e.g. 'BCNF vs 3NF', 'Lossless join condition', 'Belady anomaly')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-28 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              {isSearching ? 'Retrieving...' : 'Vector Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Document Library & Content Viewer / RAG Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 Cols): Document Repository List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Uploaded Notes Library ({notes.length})</span>
            </h3>

            <div className="space-y-2.5">
              {notes.map((doc) => {
                const isSelected = selectedNoteId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedNoteId(doc.id);
                      setSearchResults([]);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs truncate">{doc.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.fileName} • {doc.pageCount} Pages</p>
                        
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {doc.tags.map((tag, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/80 border border-slate-200 text-slate-600 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>Add Another Lecture Note (.pdf)</span>
            </button>
          </div>
        </div>

        {/* Right Column (8 Cols): Document Reader / RAG Matches */}
        <div className="lg:col-span-8 space-y-4">
          {/* If Search Results active, show RAG semantic results */}
          {searchResults.length > 0 ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    RAG Vector Matches ({searchResults.length})
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1">
                    Retrieved Excerpts for "{searchQuery}"
                  </h3>
                </div>
                <button
                  onClick={() => setSearchResults([])}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Clear Results
                </button>
              </div>

              <div className="space-y-3">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{result.heading}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold">
                          Page {result.page}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {result.relevanceScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      {result.content}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 italic">Source: {result.docTitle}</span>
                      <button
                        onClick={() => {
                          onTeachWithNote(result.heading, result.docTitle, result.content);
                          onNavigateTab('tutor');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Teach Me According to This</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Selected Document Chunk Viewer */
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Document Excerpt Viewer
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1">
                    {currentDoc.title}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    const topChunk = currentDoc.chunks[0];
                    onTeachWithNote(topChunk.heading, currentDoc.title, topChunk.content);
                    onNavigateTab('tutor');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Teach Full Unit with AI Tutor</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                📄 {currentDoc.summary}
              </p>

              {/* Chunks */}
              <div className="space-y-3 pt-1">
                {currentDoc.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-800">{chunk.heading}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        Page {chunk.page}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                      {chunk.content}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          onTeachWithNote(chunk.heading, currentDoc.title, chunk.content);
                          onNavigateTab('tutor');
                        }}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Explain this excerpt in simple English</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-800">Upload Professor Lecture Material</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomUpload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Name / PDF Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Relational Normalization Notes.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enrolled Subject</label>
                <select
                  value={uploadSubject}
                  onChange={(e: any) => setUploadSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="dbms">DBMS (CS501)</option>
                  <option value="os">Operating Systems (CS502)</option>
                  <option value="cn">Computer Networks (CS503)</option>
                  <option value="daa">Design & Analysis of Algorithms (CS504)</option>
                  <option value="se">Software Engineering (CS505)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste Excerpt or Key Syllabus Points
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste lecture text, key definitions, or formulas..."
                  value={uploadTextContent}
                  onChange={(e) => setUploadTextContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                >
                  Index & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
