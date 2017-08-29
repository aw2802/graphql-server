import SubmissionModel from './model/submission-model';

export function fetchSubmissions(args) {
  const query = {};

  query.limit = args.count || 1;

  if (args.author_id !== undefined ) {
    query.where = { author_id: args.author_id };
  }

  if (
    args.offset !== undefined &&
    args.offset !== 0
  ) {
    query.offset = args.offset;
  }

  return SubmissionModel.find(query);
}
