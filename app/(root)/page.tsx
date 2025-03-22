import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constans";
import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";

const Home = async () => {
  const result = await db.select().from(usersTable);

  console.log(JSON.stringify(result, null, 2));
  
  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest Book"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;

