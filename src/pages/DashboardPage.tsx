const DashboardPage: React.FC = () =>{
    return(
        <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 bg-gray-100 rounded">
                <h2 className="text-lg font-bold">Total Student</h2>
                <p className="text-2xl">50</p>
                </div>
                <div className="p-4 bg-gray-100 rounded">
                    <h2 className="text-lg font-bold">Recent Grades</h2>
                    <p className="text-2xl">10 added</p>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                    <h2 className="text-lg font-bold">Quick Links</h2>
                    <ul className="list-disc pl-5">
                        <li><a href="/students" className="text-blue-600 hover:underline">Students</a></li>
                        <li><a href="/gradesheets" className="text-blue-600 hover:underline">Grade Sheets</a></li>
                    </ul>
                </div>
            </div>
    );
}
export default DashboardPage;