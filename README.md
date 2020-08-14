# JSON schema template validator

## Idea

Analyzing a template file for used variables and comparing these against a JSON schema.

## Example

E.g. this template

```twig
<h1>{{ title }}</h1>

<ul>
  {% for link in links %}
    <li>
      <a href="{{ link.url }}">{{ link.label }}</a>
    </li>
  {% endfor %}
</ul>

{% if cta %}
  {{ cta }}
{% endif %}
```

could be anaylzed like this:

```yaml
- name: title
  type: string
  required: true
- name: links
  type: array
  required: true
  items:
    type: object
    properties:
      - name: url
        type: string
        required: true
      - name: label
        type: string
        required: true
- name: cta
  type: string
```

This data could be compared with the actual provided schema.

**NOTE:** This makes the assumption that every variable which is not inside an `if` e.g. is required. This is cleaner code, but in fact this is not true as a missing `title` e.g. would not create an error.

## Problems

### What to do about variables where the type is unclear

E.g. `title` and `cta` in the twig file from the example could also be of type `number` or `boolean`.
