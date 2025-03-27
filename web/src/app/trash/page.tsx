import { DataViews } from "@/components/custom/data/data-views";

const Trash = () => {
    return (
        <div>
            <section className="flex justify-between items-center">
                <span className="text-xl"> Trash </span>
                <DataViews />
            </section>
        </div>
    );
}
 
export default Trash;