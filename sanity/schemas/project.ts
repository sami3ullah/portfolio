import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'projects',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Project Category',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'string',
    }),
    defineField({
      name: 'video',
      title: 'Project Video',
      type: 'file',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'file',
    },
  },
})
