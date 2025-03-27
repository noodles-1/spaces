import { DataViews } from "@/components/custom/data/data-views";

const Home = () => {
    return (
        <div>
            <section className="flex justify-between items-center">
                <span className="text-xl"> Home </span>
                <DataViews />
            </section>
        </div>
    );
}
 
export default Home;