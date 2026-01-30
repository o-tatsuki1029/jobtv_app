"use client";

import Image from "next/image";
import Link from "next/link";
import ProgramSection from "@/components/ProgramSection";
import VideoPlayer from "@/components/VideoPlayer";
import ShortVideoSection from "@/components/ShortVideoSection";

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  mainVideo?: string;
  industry: string;
  employees: string;
  location: string;
  address: string;
  representative: string;
  capital: string;
  established: string;
  website: string;
  programs: any[];
  shortVideos: any[];
  benefits: string[];
  jobs: any[];
  events: any[];
  message: {
    title: string;
    content: string;
    image: string;
    author: string;
  };
}

export default function CompanyProfileView({ company }: { company: CompanyData }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-6 pb-12 md:pt-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* 左カラム: メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* メイン動画プレイヤー */}
            {company.mainVideo && (
              <section className="-mx-4 md:mx-0">
                <div className="overflow-hidden md:rounded-lg shadow-2xl border-y md:border border-gray-800 bg-black">
                  <VideoPlayer src={company.mainVideo} poster={company.coverImage} className="w-full aspect-video" />
                </div>
                <div className="mt-4 md:mt-6 px-4 md:px-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-cover rounded-md border border-gray-800"
                      />
                    </div>
                    <div>
                      <h1 className="text-lg md:text-2xl font-bold text-white mb-0.5">{company.name}</h1>
                      <p className="text-gray-400 text-[10px] md:text-sm font-medium">{company.industry}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20">
                      エントリーする
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* 企業説明 */}
            <section className="bg-gray-800/30 p-5 md:p-8 rounded-lg border border-gray-800">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                企業について
              </h2>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {company.description}
              </p>
            </section>

            {/* ショート動画一覧 */}
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                ショート動画
              </h2>
              <ShortVideoSection title="" videos={company.shortVideos} showMore={false} />
            </section>

            {/* 求人一覧 */}
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                募集中の求人
              </h2>
              <div className="space-y-3 md:space-y-4">
                {company.jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/job/${job.id}`}
                    className="block bg-gray-800/50 p-4 md:p-6 rounded-lg border border-gray-700/50 hover:border-red-600/50 hover:bg-gray-800 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                          <span className="px-2 py-0.5 bg-red-600/10 text-red-500 text-[10px] md:text-xs font-bold rounded border border-red-600/20">
                            {job.type}
                          </span>
                          <h3 className="text-base md:text-lg font-bold group-hover:text-red-500 transition-colors">
                            {job.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-1 md:gap-y-2 text-xs md:text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center text-red-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        詳細を見る
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 説明会・イベント */}
            <section>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                  説明会・イベント
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/session/${event.id}`}
                    className="group bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden hover:border-red-600/50 transition-all flex flex-col"
                  >
                    <div className="p-4 md:p-5 flex-1">
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-[10px] font-bold rounded border border-blue-600/20 uppercase tracking-wider">
                          {event.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${
                            event.status === "受付中"
                              ? "bg-green-600/10 text-green-400 border-green-600/20"
                              : "bg-orange-600/10 text-orange-400 border-orange-600/20"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4 group-hover:text-red-500 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-2.5 md:py-3 bg-gray-800/80 border-t border-gray-700/50 text-[10px] md:text-xs font-bold text-center group-hover:bg-red-600 group-hover:text-white transition-all">
                      説明会詳細・予約
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* メッセージセクション */}
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                採用メッセージ
              </h2>
              <div className="bg-gray-800/30 rounded-lg border border-gray-800 overflow-hidden">
                <div className="relative h-40 md:h-64 w-full">
                  <Image src={company.message.image} alt="採用メッセージ" fill className="object-cover" />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">{company.message.title}</h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">
                    {company.message.content}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
                      <Image
                        src={company.logo}
                        alt={company.message.author}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm md:text-base text-white font-bold">{company.message.author}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 福利厚生 */}
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                福利厚生・制度
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {company.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-gray-200 font-medium">{benefit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* 会社概要 */}
            <section>
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 md:h-6 bg-red-600 rounded-full" />
                会社概要
              </h2>
              <div className="bg-gray-800/30 rounded-lg border border-gray-800 overflow-hidden max-w-3xl">
                <dl className="divide-y divide-gray-800">
                  {[
                    { label: "会社名", value: company.name },
                    { label: "代表者", value: company.representative },
                    { label: "設立", value: company.established },
                    { label: "資本金", value: company.capital },
                    { label: "所在地", value: company.address },
                    { label: "従業員数", value: company.employees },
                    { label: "事業内容", value: company.industry },
                    {
                      label: "公式サイト",
                      value: company.website,
                      isLink: true
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row p-4 md:p-6 gap-1 md:gap-6">
                      <dt className="sm:w-32 flex-shrink-0 text-gray-500 text-xs md:text-sm font-medium">
                        {item.label}
                      </dt>
                      <dd className="text-sm md:text-base text-gray-200">
                        {item.isLink ? (
                          <a
                            href={item.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {item.value}
                            <svg
                              className="w-3 h-3 md:w-3.5 md:h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          </div>

          {/* 右カラム: サイドバー（詳細情報 & アクション） */}
          <div className="space-y-6 lg:self-start sticky top-24 space-y-6">
            {/* 企業基本情報カード */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-800 overflow-hidden shadow-xl">
              {/* カバー画像 */}
              <div className="relative h-24 md:h-32 w-full">
                <Image src={company.coverImage} alt={company.name} fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </div>

              <div className="p-5 md:p-6 pt-0 -mt-8 md:-mt-10 relative z-10">
                <div className="flex flex-col items-start text-left">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-cover rounded-lg border-4 border-gray-800 shadow-xl"
                    />
                  </div>
                  <h1 className="text-lg md:text-xl font-bold mb-1">{company.name}</h1>
                  <p className="text-gray-400 text-xs md:text-sm mb-5 md:mb-6">{company.industry}</p>

                  <div className="w-full space-y-3">
                    <button className="w-full py-3.5 md:py-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-base md:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20">
                      エントリーする
                    </button>
                    <Link
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 md:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-semibold text-sm md:text-base transition-colors flex items-center justify-center gap-2 border border-gray-600"
                    >
                      公式サイトを訪問
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700 space-y-4">
                  <h3 className="text-[10px] md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    企業詳細情報
                  </h3>
                  <dl className="space-y-3 md:space-y-4">
                    {[
                      {
                        label: "従業員数",
                        value: company.employees,
                        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      },
                      {
                        label: "所在地",
                        value: company.location,
                        icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      },
                      {
                        label: "設立",
                        value: company.established,
                        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <div>
                          <dt className="text-[10px] md:text-xs text-gray-500">{item.label}</dt>
                          <dd className="text-xs md:text-sm font-medium text-gray-200">{item.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 関連動画セクション (全幅) */}
        <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-gray-800">
          <ProgramSection
            title={`${company.name}の他の動画`}
            programs={company.programs}
            vertical={true}
            showMore={false}
          />
        </div>
      </div>
    </div>
  );
}
