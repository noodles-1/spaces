import { TreeView } from "@/components/custom/data/tree/tree-view";

const Storage = () => {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <section className="flex items-center justify-between">
                <span className="text-xl"> Storage </span>
            </section>
            <main>
                <TreeView />
            </main>
        </div>
    );
};

export default Storage;
