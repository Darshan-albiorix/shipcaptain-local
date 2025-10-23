export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-black/60">Configure organization and account preferences.</p>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-5 grid gap-4">
        <label className="grid gap-1 text-sm">
          <span>Organization name</span>
          <input className="px-3 py-2 border border-black/20 rounded-md outline-none focus:ring-2 focus:ring-black/20" defaultValue="ShipCaptain" />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Support email</span>
          <input className="px-3 py-2 border border-black/20 rounded-md outline-none focus:ring-2 focus:ring-black/20" defaultValue="support@example.com" />
        </label>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-md bg-black text-white text-sm">Save changes</button>
          <button className="px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-[#E7E2D9]">Cancel</button>
        </div>
      </div>
    </div>
  );
}


