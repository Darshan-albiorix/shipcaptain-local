export default function UsersPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-black/60">Browse and manage user accounts.</p>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <input
            type="search"
            placeholder="Search users"
            className="px-3 py-2 border border-black/20 rounded-md outline-none focus:ring-2 focus:ring-black/20 bg-white placeholder-black/40"
          />
          <button className="px-3 py-2 rounded-md bg-black text-white text-sm">Invite user</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/10">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/10">
                <td className="py-3 pr-4">Jane Doe</td>
                <td className="py-3 pr-4">jane@example.com</td>
                <td className="py-3 pr-4"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-black">Admin</span></td>
                <td className="py-3 text-right"><button className="px-2 py-1 rounded-md border border-black/10 hover:bg-[#E7E2D9]">Edit</button></td>
              </tr>
              <tr>
                <td className="py-3 pr-4">John Smith</td>
                <td className="py-3 pr-4">john@example.com</td>
                <td className="py-3 pr-4"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-black">Viewer</span></td>
                <td className="py-3 text-right"><button className="px-2 py-1 rounded-md border border-black/10 hover:bg-[#E7E2D9]">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


