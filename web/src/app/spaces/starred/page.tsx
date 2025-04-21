import { DataViews } from "@/components/custom/data/data-views";

const Starred = () => {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <section className="flex items-center justify-between">
                <span className="text-xl"> Starred </span>
                <DataViews />
            </section>
        </div>
    );
};

export default Starred;
