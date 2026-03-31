import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateCategoryDto) {
    const result = await this.db.execute(
      `INSERT INTO Category (name, slug, parentId, createdAt, updatedAt)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [dto.name, dto.slug.toLowerCase(), dto.parentId ?? null],
    );
    const id = result.insertId;

    const category = await this.db.queryOne<any>(
      'SELECT * FROM Category WHERE id = ?',
      [id],
    );

    if (dto.parentId) {
      category.parent = await this.db.queryOne<any>(
        'SELECT * FROM Category WHERE id = ?',
        [dto.parentId],
      );
    } else {
      category.parent = null;
    }

    return category;
  }

  async findAll() {
    const roots = await this.db.query<any>(
      'SELECT * FROM Category WHERE parentId IS NULL ORDER BY name ASC',
    );

    for (const root of roots) {
      const courseCount = await this.db.queryOne<any>(
        'SELECT COUNT(*) as cnt FROM Course WHERE categoryId = ?',
        [root.id],
      );
      root._count = { courses: Number(courseCount?.cnt ?? 0) };

      root.children = await this.db.query<any>(
        'SELECT * FROM Category WHERE parentId = ? ORDER BY name ASC',
        [root.id],
      );

      for (const child of root.children) {
        child.children = await this.db.query<any>(
          'SELECT * FROM Category WHERE parentId = ? ORDER BY name ASC',
          [child.id],
        );
      }
    }

    return roots;
  }

  async findBySlug(slug: string) {
    const category = await this.db.queryOne<any>(
      'SELECT * FROM Category WHERE slug = ?',
      [slug],
    );
    if (!category) throw new NotFoundException('Category not found');

    category.children = await this.db.query<any>(
      'SELECT * FROM Category WHERE parentId = ?',
      [category.id],
    );

    category.courses = await this.db.query<any>(
      `SELECT c.id, c.title, c.slug, c.price, c.level, c.thumbnailUrl,
              u.id as instructorId, u.name as instructorName
       FROM Course c
       JOIN User u ON c.instructorId = u.id
       WHERE c.categoryId = ? AND c.isPublished = 1`,
      [category.id],
    );

    category.courses = category.courses.map((c: any) => ({
      id: c.id, title: c.title, slug: c.slug, price: c.price,
      level: c.level, thumbnailUrl: c.thumbnailUrl,
      instructor: { id: c.instructorId, name: c.instructorName },
    }));

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const sets: string[] = [];
    const params: any[] = [];
    if (dto.name !== undefined) { sets.push('name = ?'); params.push(dto.name); }
    if (dto.slug !== undefined) { sets.push('slug = ?'); params.push(dto.slug.toLowerCase()); }
    if (dto.parentId !== undefined) { sets.push('parentId = ?'); params.push(dto.parentId); }

    if (sets.length > 0) {
      sets.push('updatedAt = NOW()');
      params.push(id);
      await this.db.execute(`UPDATE Category SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    return this.db.queryOne('SELECT * FROM Category WHERE id = ?', [id]);
  }

  async remove(id: string) {
    await this.db.execute('DELETE FROM Category WHERE id = ?', [id]);
    return { deleted: true };
  }
}
