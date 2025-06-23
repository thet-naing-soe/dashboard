import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function BrandLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <ClipboardDocumentListIcon className="h-12 w-12" />
      <p className="text-[32px] ml-2">Kanban</p>
    </div>
  );
}
