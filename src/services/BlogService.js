//예시임 이렇게 쓰면 됨

// const NaverBlogDirectoryRepo = require('../repositories/NaverBlogDirectoryRepo')
// const TargetKeywordRepo = require('../repositories/TargetKeywordRepo')

// class BlogService {
//   async getNaverDirectoryInfo() {
//     const result = await NaverBlogDirectoryRepo.find({})
//     return result
//   }

//   async postNaverBlogKeyword(date, keywords, seq) {
//     const result = await TargetKeywordRepo.updateOne({
//       filter: { date, seq },
//       update: {
//         $set: {
//           date,
//           seq,
//           updatedAt: new Date(),
//         },
//         $addToSet: {
//           keywords: { $each: [...keywords] },
//         },
//         $setOnInsert: {
//           createdAt: new Date(),
//         },
//       },
//       option: {
//         upsert: true,
//       },
//     })
//     return result
//   }

//   async getNaverBlogKeyword(date) {
//     const result = await TargetKeywordRepo.find({
//       filter: {
//         date,
//       },
//     })
//     return result
//   }
// }

// module.exports = new BlogService()
