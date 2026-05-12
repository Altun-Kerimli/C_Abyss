import { logout } from '@/app/lib/actions';
import Link from 'next/link'; // ADD THIS LINE

export default function AdminDashboard() {
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-violet-400 uppercase tracking-widest">Command Center</h1>
        <form action={logout}>
          <button type="submit" className="text-sm border border-red-900/50 hover:bg-red-900/20 text-red-400 px-4 py-2 rounded transition-colors">
            End Session
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Announcements */}
        <Link href="adminOfTheAbyss/announcements/" className="group block bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-violet-500 transition-colors">
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400">📢 Announcements</h2>
          <p className="text-gray-400 text-sm">Manage and broadcast announcements to users.</p>
        </Link>

        {/* Albums */}
        <Link href="adminOfTheAbyss/albums/" className="group block bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-violet-500 transition-colors">
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400">💿 Albums Database</h2>
          <p className="text-gray-400 text-sm">Manage releases, upcoming drops, and edit metadata.</p>
        </Link>
        
        {/* Gallery */}
        <Link href="adminOfTheAbyss/gallery/" className="group block bg-gray-900/20 p-6 rounded-xl border border-gray-800 hover:border-violet-500 transition-colors">
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400">📷 Gallery Database</h2>
          <p className="text-gray-400 text-sm">Manage images and media assets.</p>
        </Link>
        
        {/* Storage */}
        <Link href="adminOfTheAbyss/storage/" className="group block bg-gray-900/20 p-6 rounded-xl border border-gray-800 hover:border-violet-500 transition-colors">
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400">💾 Storage Management</h2>
          <p className="text-gray-400 text-sm">Manage and organize stored files and assets.</p>
        </Link>
        
        {/* Future grids can go here */}
        <div className="bg-gray-900/20 p-6 rounded-xl border border-gray-800 border-dashed opacity-50">
          <h2 className="text-xl font-bold text-gray-500 mb-2">🔒 Future Module</h2>
          <p className="text-gray-600 text-sm">Awaiting deployment.</p>
        </div>
      </div>
    </div>
  );
}