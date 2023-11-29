import Link from "next/link"
import Layout from "../components/layout"
import { fetchIndex } from "../lib/data"

export const getStaticProps = async ({ params }) => {
  const { lists } = await fetchIndex()
  return { props: { data: { lists } }, revalidate: false }
}

export default function Home({ data }) {
  const { lists } = data

  return (
    <Layout title="Main">
      <article className="post content">
        <h1 className="title has-text-centered">
          Welcome to NovelNest
        </h1>
        <p>
          NovelNest Provides Online Novels, aiming at providing good view for readers 
        </p>
        <h2 className="title has-text-centered" id="catalog">
          Catalog
        </h2>
        <p className="subtitle" style={{ fontSize: "1.25em" }}>
          Already collected novels: {lists.length} 
        </p>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Author</th>
              <th>Number of chapters</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr key={list.aid}>
                <td>{list.aid}</td>
                <td>
                  <Link href="/[aid]/" as={`/${list.aid}/`}>
                    {list.title}
                  </Link>
                </td>
                <td>{list.author}</td>
                <td>{list.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </Layout>
  )
}
