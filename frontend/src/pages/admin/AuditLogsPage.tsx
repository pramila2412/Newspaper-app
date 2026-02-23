import React, { useEffect, useState } from 'react';
import { auditAPI } from '../../api/services';

const AuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        auditAPI.list({ page, limit: 50 }).then(({ data }) => setLogs(data.logs)).catch(() => { }).finally(() => setLoading(false));
    }, [page]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark mb-6">Audit Logs</h1>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr className="text-left text-gray-500"><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3 hidden sm:table-cell">Entity</th><th className="px-4 py-3 hidden md:table-cell">Time</th></tr></thead>
                            <tbody className="divide-y">
                                {logs.map((log: any) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{log.userId?.name || 'System'}</td>
                                        <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">{log.action}</span></td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{log.entity}</td>
                                        <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="flex justify-center gap-2 mt-4">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Prev</button>
                <span className="px-3 py-1 text-sm text-gray-500">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 50} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

export default AuditLogsPage;
