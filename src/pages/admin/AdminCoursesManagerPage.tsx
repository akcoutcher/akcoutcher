import React, { useState, useEffect } from 'react';
import {
  getCourses,
  saveCourse,
  deleteCourse,
  getCourseCategories,
  saveCourseCategory,
  deleteCourseCategory,
  getAllEnrollments,
  getRegisteredStudents,
  getAllCertificates,
  updateCertificateStatus,
  getAcademySettings,
  updateAcademySettings,
  getCourseModules,
  saveCourseModule,
  deleteCourseModule,
  getCourseQuiz,
  saveCourseQuiz
} from '../../lib/courseDb';
import {
  Course,
  CourseCategory,
  CourseEnrollment,
  StudentUser,
  IssuedCertificate,
  AcademySettings,
  CourseModule
} from '../../types/courses';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Award,
  Users,
  Sliders,
  Search,
  FolderKanban,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const AdminCoursesManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'categories' | 'students' | 'certificates' | 'settings'>('courses');

  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [academySettings, setAcademySettings] = useState<AcademySettings>(getAcademySettings());

  // Search & Modals
  const [search, setSearch] = useState('');
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<CourseCategory> | null>(null);

  const refreshData = () => {
    setCourses(getCourses());
    setCategories(getCourseCategories());
    setStudents(getRegisteredStudents());
    setEnrollments(getAllEnrollments());
    setCertificates(getAllCertificates());
    setAcademySettings(getAcademySettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for Course CRUD
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse?.title) return;
    saveCourse(currentCourse as any);
    setIsEditingCourse(false);
    setCurrentCourse(null);
    refreshData();
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
      refreshData();
    }
  };

  // Handlers for Category CRUD
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory?.name) return;
    saveCourseCategory(currentCategory as any);
    setIsEditingCategory(false);
    setCurrentCategory(null);
    refreshData();
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Delete this course category?')) {
      deleteCourseCategory(id);
      refreshData();
    }
  };

  // Certificate Status Toggle
  const handleToggleCertStatus = (id: string, currentStatus: 'valid' | 'revoked') => {
    const next = currentStatus === 'valid' ? 'revoked' : 'valid';
    updateCertificateStatus(id, next);
    refreshData();
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademySettings(academySettings);
    alert('Academy & Certificate Settings saved successfully!');
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-950 p-6 rounded-2xl border border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] text-xs uppercase font-bold tracking-widest">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Management</span>
          </div>
          <h1 className="font-serif text-2xl text-white font-medium mt-1">
            Training &amp; Courses CMS
          </h1>
          <p className="text-xs text-stone-400">
            Manage courses, categories, curriculum modules, student enrollments, and issued certificates.
          </p>
        </div>

        {activeTab === 'courses' && (
          <button
            onClick={() => {
              setCurrentCourse({
                title: '',
                slug: '',
                courseCode: `AKC-FD-${Math.floor(100 + Math.random() * 900)}`,
                category: categories[0]?.name || 'Fashion Designing',
                level: 'Beginner',
                type: 'paid',
                price: 9999,
                discountPrice: 4999,
                duration: '6 Weeks',
                totalLessons: 12,
                image: '/src/assets/images/hero_ak_couture_1790594513046.jpg',
                description: '',
                shortDescription: '',
                status: 'published',
                mode: 'Online Video & Practical',
                requirements: ['Basic sketching supplies'],
                learningOutcomes: ['Design foundational garments'],
                whoIsThisFor: ['Aspiring designers'],
                certificateAvailable: true,
                rating: 5.0,
                studentsCount: 0,
                faqs: [],
              });
              setIsEditingCourse(true);
            }}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        )}

        {activeTab === 'categories' && (
          <button
            onClick={() => {
              setCurrentCategory({ name: '', slug: '', description: '', order: categories.length + 1 });
              setIsEditingCategory(true);
            }}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 text-xs font-semibold uppercase tracking-wider gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'courses' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'students' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students &amp; Enrollments ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'certificates' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Issued Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings' ? 'border-[#C5A059] text-[#C5A059]' : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Academy Settings</span>
        </button>
      </div>

      {/* TAB 1: COURSES LIST */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Course</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Students</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-800/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={c.image} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-medium text-white block">{c.title}</span>
                            <span className="font-mono text-[10px] text-[#C5A059]">{c.courseCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {c.type === 'free' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            FREE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#58111A] text-[#C5A059]">
                            PAID
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{c.category}</td>
                      <td className="py-3.5 px-4 font-mono">
                        {c.type === 'free' ? '₹0' : `₹${c.discountPrice || c.price}`}
                      </td>
                      <td className="py-3.5 px-4">{c.studentsCount || 0}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          c.status === 'published' ? 'text-emerald-400 bg-emerald-950/60' : 'text-stone-400 bg-stone-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setCurrentCourse(c);
                            setIsEditingCourse(true);
                          }}
                          className="p-1.5 hover:bg-stone-700 rounded text-stone-300 hover:text-white"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-1.5 hover:bg-red-950 rounded text-red-400 hover:text-red-300"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES LIST */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#C5A059] font-mono">
                    <span>Order #{cat.order}</span>
                    <span>slug: {cat.slug}</span>
                  </div>
                  <h4 className="font-serif text-base font-medium text-white mt-1">{cat.name}</h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{cat.description || 'No description'}</p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setCurrentCategory(cat);
                      setIsEditingCategory(true);
                    }}
                    className="p-1.5 hover:bg-stone-800 rounded text-stone-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 hover:bg-red-950 rounded text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS & ENROLLMENTS */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Course Enrolled</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-4">Completion</th>
                    <th className="py-3.5 px-4">Certificate ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {enrollments.map((enr) => {
                    const st = students.find((s) => s.id === enr.studentId);
                    const cs = courses.find((c) => c.id === enr.courseId);

                    return (
                      <tr key={enr.id} className="hover:bg-stone-800/40">
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-white block">{st?.name || enr.studentId}</span>
                          <span className="text-[11px] text-stone-400">{st?.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-200">
                          {cs?.title || enr.courseId}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            enr.paymentStatus === 'free' ? 'text-emerald-300 bg-emerald-950' : 'text-[#C5A059] bg-[#58111A]'
                          }`}>
                            {enr.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{enr.progress}%</td>
                        <td className="py-3.5 px-4">
                          {enr.completionStatus === 'completed' ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Completed
                            </span>
                          ) : (
                            <span className="text-stone-400">In Progress</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#C5A059]">
                          {enr.certificateId || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ISSUED CERTIFICATES (Requirement 13) */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Certificate ID</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Course</th>
                    <th className="py-3.5 px-4">Issue Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-stone-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C5A059]">
                        {cert.certificateId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">{cert.studentName}</td>
                      <td className="py-3.5 px-4 text-stone-300">{cert.courseName}</td>
                      <td className="py-3.5 px-4 text-stone-400">{cert.issueDate}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          cert.status === 'valid' ? 'text-emerald-400 bg-emerald-950 border border-emerald-800' : 'text-red-400 bg-red-950 border border-red-800'
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleCertStatus(cert.id, cert.status)}
                          className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[10px] font-semibold"
                        >
                          Mark {cert.status === 'valid' ? 'Invalid' : 'Valid'}
                        </button>
                        <a
                          href={`/verify/${cert.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:text-[#C5A059] inline-block"
                          title="Verify in public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5 inline" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACADEMY & CERTIFICATE SETTINGS (Requirement 21) */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6 max-w-3xl">
          <h3 className="font-serif text-xl text-white font-medium">Academy &amp; Certificate Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-400 mb-1 font-medium">Institute Name</label>
              <input
                type="text"
                value={academySettings.instituteName}
                onChange={(e) => setAcademySettings({ ...academySettings, instituteName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Tagline</label>
              <input
                type="text"
                value={academySettings.tagline}
                onChange={(e) => setAcademySettings({ ...academySettings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Certificate Prefix (Default: AKC-FD)</label>
              <input
                type="text"
                value={academySettings.certificatePrefix}
                onChange={(e) => setAcademySettings({ ...academySettings, certificatePrefix: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Authorized Signature Name</label>
              <input
                type="text"
                value={academySettings.certificateSignature}
                onChange={(e) => setAcademySettings({ ...academySettings, certificateSignature: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Contact Phone</label>
              <input
                type="text"
                value={academySettings.phone}
                onChange={(e) => setAcademySettings({ ...academySettings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Contact Email</label>
              <input
                type="email"
                value={academySettings.email}
                onChange={(e) => setAcademySettings({ ...academySettings, email: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1 font-medium">Address</label>
              <input
                type="text"
                value={academySettings.address}
                onChange={(e) => setAcademySettings({ ...academySettings, address: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-wider font-bold rounded-xl shadow-md cursor-pointer"
          >
            Save Settings
          </button>
        </form>
      )}

      {/* CREATE / EDIT COURSE MODAL */}
      {isEditingCourse && currentCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl text-white font-medium">
              {currentCourse.id ? 'Edit Course' : 'Create New Course'}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={currentCourse.title || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={currentCourse.courseCode || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, courseCode: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={currentCourse.category || categories[0]?.name}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Type</label>
                  <select
                    value={currentCourse.type || 'paid'}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Level</label>
                  <select
                    value={currentCourse.level || 'Beginner'}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, level: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Status</label>
                  <select
                    value={currentCourse.status || 'published'}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {currentCourse.type === 'paid' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1">Standard Price (₹)</label>
                    <input
                      type="number"
                      value={currentCourse.price || 0}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      value={currentCourse.discountPrice || ''}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, discountPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-stone-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={currentCourse.shortDescription || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={currentCourse.description || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsEditingCourse(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] text-stone-950 font-bold rounded-lg hover:bg-[#D4AF37]"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isEditingCategory && currentCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-serif text-xl text-white font-medium">
              {currentCategory.id ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={currentCategory.name || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={currentCategory.slug || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                  placeholder="e.g. pattern-making"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={currentCategory.description || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsEditingCategory(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] text-stone-950 font-bold rounded-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
