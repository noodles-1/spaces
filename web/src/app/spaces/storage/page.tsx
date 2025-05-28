import { TreeView } from "@/components/custom/data/tree/tree-view";

const Storage = () => {
    return (
        <div className="flex flex-1 flex-col gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Storage </span>
            </section>
            <main className="p-6">
                <TreeView />
            </main>
        </div>
    );
};

export default Storage;
