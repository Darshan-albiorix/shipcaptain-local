export default function DashboardHome() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="group rounded-xl border border-black/10 bg-white p-5 transition">
          <div className="text-sm text-black/60">Users</div>
          <div className="text-3xl font-semibold">1,248</div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-black">+2.1%</span>
        </div>
        <div className="group rounded-xl border border-black/10 bg-white p-5 transition">
          <div className="text-sm text-black/60">Revenue</div>
          <div className="text-3xl font-semibold">$32,480</div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-black">last 7d</span>
        </div>
        <div className="group rounded-xl border border-black/10 bg-white p-5 transition">
          <div className="text-sm text-black/60">Errors</div>
          <div className="text-3xl font-semibold">7</div>
          <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#E7E2D9] text-black">-1</span>
        </div>
      </div>
  
    </div>
  );
}


