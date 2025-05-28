import { DataViews } from "@/components/custom/data/data-views";

const Starred = () => {
    return (
        <div className="flex flex-1 flex-col gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Starred </span>
                <DataViews />
            </section>
        </div>
    );
};

export default Starred;
