import { DataViews } from "@/components/custom/data/data-views";

const Starred = () => {
    return (
        <div>
            <section className="flex justify-between items-center">
                <span className="text-xl"> Starred </span>
                <DataViews />
            </section>
        </div>
    );
}
 
export default Starred;