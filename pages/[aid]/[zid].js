import React from "react"
import Link from "next/link"
import Error from "next/error"
import { useRouter } from "next/router"
import * as matter from "gray-matter"
import Layout from "../../components/layout"
import Git from "../../components/git"
import markdown from "../../lib/micromark"
import { fetchIndex, fetchPage, fetchDir } from "../../lib/data"

export async function getStaticPaths() {
  const { lists } = await fetchIndex()
  const paths = []
  lists.map(async (list) => {
    const aid = list.aid
    const parent = await fetchDir(aid)
    parent.pages.map((page) => {
      paths.push({
        params: {
          aid: aid,
          zid: page.zid,
        },
      })
    })
  })

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
  const { aid, zid } = params

  const text = await fetchPage(aid, `${zid}.md`)
  const parent = await fetchDir(aid)
  if (!text || !parent) return { props: { data: null } }

  const { title, pages } = parent
  const i = pages.findIndex((e) => e.zid === zid)
  const data = {
    text,
    pt: title,
    lastmod: pages[i].lastmod,
    wordCount: pages[i].wordCount,
  }

  if (i !== 0) {
    data.prev = {
      title: pages[i - 1].title,
      zid: pages[i - 1].zid,
    }
  }
  if (i !== pages.length - 1) {
    data.next = {
      title: pages[i + 1].title,
      zid: pages[i + 1].zid,
    }
  }

  return { props: { data, params }, revalidate: 1 }
}

const Next = ({ prev, next, aid, pt }) => (
  <nav className="columns">
    <div className="column has-text-centered">
      <p className="title" style={{ fontSize: "1.25em" }}>
        {prev ? "Prev Chapter" : "Go Back"}
      </p>
      <Link
        href={prev ? "/[aid]/[zid]" : "/[aid]/"}
        as={prev ? `/${aid}/${prev.zid}` : `/${aid}/`}
        className="subtitle"
        style={{ fontSize: "1.25em" }}
      >
        {prev ? prev.title : pt}
      </Link>
    </div>
    <div className="column has-text-centered">
      <p className="title" style={{ fontSize: "1.25em" }}>
        {next ? "Next Chapter" : "Go Back"}
      </p>
      <Link
        href={next ? "/[aid]/[zid]" : "/[aid]/"}
        as={next ? `/${aid}/${next.zid}` : `/${aid}/`}
        className="subtitle"
        style={{ fontSize: "1.25em" }}
      >
        {next ? next.title : pt}
      </Link>
    </div>
  </nav>
)

export default function Single({ data }) {
  const { isFallback } = useRouter()

  if (isFallback) {
    return (
      <Layout title="Loading">
        <div id="loading">Loading...</div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout title="404 Not Found">
        <Error statusCode={404} title="Not Found" />
      </Layout>
    )
  }

  const { text, pt, lastmod, wordCount, next, prev } = data
  const ma = matter(text)
  const { aid, zid, title, author } = ma.data
  const content = ma.content
  const html = markdown(content)

  return (
    <Layout title={`${title} - ${pt}`}>
      <Next prev={prev} next={next} aid={aid} pt={pt} />
      <article className="post content mb-6">
        <h3 className="title has-text-centered">{title}</h3>
        <p
          className="subtitle has-text-centered"
          style={{ fontSize: "1.25em" }}
        >
          <Link href="/[aid]/" as={`/${aid}/`}>
            {pt}
          </Link>
          {` | ${author} | Approx words: ${wordCount} | `}
          <Git path={`content/${aid}/${zid}.md`}></Git>
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <Next prev={prev} next={next} aid={aid} pt={pt} />
    </Layout>
  )
}
