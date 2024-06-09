export const HIERACHY_QUERY = `
WITH RECURSIVE location_cte AS (SELECT location.id, location.name, location.location_code,
          location.area,
          location.building_id,
          location.parent_location_id
        FROM
          location_schema.location
        WHERE
          id = $1
        UNION ALL
        SELECT
          loc.id,
          loc.name,
          loc.location_code,
          loc.area,
          loc.building_id,
          loc.parent_location_id
        FROM
          location_schema.location loc
        INNER JOIN
          location_cte cte ON cte.id = loc.parent_location_id
      )
      SELECT
        loca.id,
        loca.name,
        loca.location_code,
        loca.area,
        loca.building_id,
        loca.parent_location_id,
        bd.name as building_name,
        CASE 
          WHEN loca.parent_location_id IS NOT NULL THEN bd.name || '-' || parent_loca.location_code || '-' || loca.location_code
          ELSE bd.name || '-' || loca.location_code
        END as location_number
      FROM
        location_cte as loca
        INNER JOIN location_schema.building as bd on loca.building_id = bd.id
        LEFT JOIN location_schema.location as parent_loca on loca.parent_location_id = parent_loca.id
`;
