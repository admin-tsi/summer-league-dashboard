const Standings = () => (
  <div className="border rounded-md p-5 max-md:mb-12 h-fit md:h-[550px] gap-2">
    <div className="flex justify-between items-center text-sm">
      <span className="text-1xl font-bold">Standings</span>
    </div>
    {/* <div className="w-full pt-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">Position</TableHead>
            <TableHead className="w-8/12">Team</TableHead>
            <TableHead className="w-3/12">Point</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">kj</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div> */}
    <div className="w-full h-full flex justify-center items-center">
      <span className="w-full max-sm:py-3 md:w-1/2 text-center">
        There is currently no ranking for the summer league. It will be
        displayed here once it becomes available.
      </span>
    </div>
  </div>
);

export default Standings;
