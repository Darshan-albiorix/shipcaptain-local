export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#171717]">Welcome</h1>
        <p className="text-black/60 mt-2">Manage your fleet and operations from here.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-black/10 p-5 transition hover:shadow-md">
          <div className="text-sm text-black/60">Total Users</div>
          <div className="text-3xl font-semibold text-[#171717] mt-1">1,248</div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-[#171717]">+2.1%</span>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-5 transition hover:shadow-md">
          <div className="text-sm text-black/60">Revenue</div>
          <div className="text-3xl font-semibold text-[#171717] mt-1">$32,480</div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-[#171717]">last 7d</span>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-5 transition hover:shadow-md">
          <div className="text-sm text-black/60">Active Ships</div>
          <div className="text-3xl font-semibold text-[#171717] mt-1">47</div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-[#171717]">-1</span>
        </div>
      </div>
    </div>
  );
}


